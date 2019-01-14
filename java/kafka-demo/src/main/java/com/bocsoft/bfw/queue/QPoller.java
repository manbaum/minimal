package com.bocsoft.bfw.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 * 队列轮询器。封装通用消息处理逻辑。可作为任务交由线程池派发执行。
 *
 * <p></p>
 *
 * <p>轮询逻辑如下：</p>
 * <ol>
 * <li>若收到结束轮询请求，则结束轮询并返回，否则继续；</li>
 * <li>调用 {@link QConsumer#poll(Duration)} 方法获得记录集；</li>
 * <li>若记录集为空，则根据轮询间隔时间设置，进入睡眠等待，睡眠结束后回到第 1 步；</li>
 * <li>若记录集不为空，则进入如下子流程：
 * <ol>
 * <li>调用记录集处理前钩子函数 {@link #batchBegin(QConsumerRecords)}；</li>
 * <li>针对每条记录，调用记录处理器进行处理；如果处理过程中出错，则调用出错处理器处理；</li>
 * <li>调用 {@link QConsumer#commitSync()} 提交记录读取指针；</li>
 * <li>调用记录集处理后钩子函数 {@link #batchEnd(QConsumerRecords)}；</li>
 * </ol>
 * </li>
 * <li>循环回到第 1 步。</li>
 * </ol>
 *
 * <p>轮询过程中，记录处理器的异常会被异常处理器捕获，异常处理器的异常将会被忽略。
 * 之所以使用这样的逻辑，是为了保证单条记录的处理过程不会影响并打断完整记录集的处理，
 * 防止记录被漏处理的情况出现，防止数据丢失。</p>
 *
 * <p></p>
 *
 * <p>参数说明如下：</p>
 * <ul>
 * <li><code>recordHandler</code> - 记录处理器。</li>
 * <li><code>errorHandler</code> - 异常处理器。</li>
 * <li><code>pollingTimeout</code> - 轮询超时时间，缺省值为 100 毫秒(ms)。</li>
 * <li><code>pollingIdle</code> - 轮询间隔睡眠时间，缺省值为 100 毫秒(ms)。</li>
 * <li><code>logEveryRecord</code> - 日志记录每条记录，缺省值为 <code>false</code>。</li>
 * <li><code>logFailedRecord</code> - 日志记录失败记录，缺省值为 <code>false</code>。</li>
 * </ul>
 *
 * <p>记录处理器以及出错处理器不能为空，
 * 否则将抛出 <code>java.lang.NullPointerException</code> 异常，轮询失败。</p>
 *
 * <p></p>
 *
 * <p>轮询间隔睡眠只有当上一次轮询获得的记录集为空时才发生。也就是说，当队列中有消息要处理时，
 * 轮询处理器将不停歇的持续循环处理消息，以获得最大吞吐量；只有当队列中无可处理的消息时，
 * 轮询处理器才会进入睡眠，等待 <code>pollingIdle</code> 的时长，然后再次进入轮询。</p>
 *
 * <p></p>
 *
 * <p>日志记录失败记录仅当出错处理器执行发生异常时才有效。如果出错处理器执行正常，
 * 则认为原异常已被处理，错误已被恢复。若有必要可在出错处理器中将失败记录输出到日志中。</p>
 *
 * <p></p>
 *
 * <p>队列轮询器使用示例如下 (假设消息键值为 <code>Integer</code> 类型，
 * 消息值为 <code>String</code> 类型)：</p>
 * <pre>
 *     QConsumer&lt;Integer, String&gt consumer = ...;
 *     MyContext ctx = ...;
 *     QRecordHandler&lt;Integer, String, MyContext&gt; recordHandler = ...;
 *     QErrorHandler&lt;Integer, String, MyContext&gt; errorHandler = ...;
 *     QPoller&lt;Integer, String, MyContext&gt; poller = new QPoller&lt;&gt;(consumer, ctx);
 *     poller.setRecordHandler(recordHandler);
 *     poller.setErrorHandler(errorHandler);
 *     poller.setLogFailedRecord(true);
 *
 *     ExecutorService executor = ...;
 *     executor.submit(poller);
 *
 *     ...
 *     poller.stop();
 *     executor.shutdown();
 *     executor.awaitTermination(5000L, TimeUnit.MILLISECONDS);
 * </pre>
 *
 * <p></p>
 *
 * @author manbaum
 * @see QConsumer#poll(Duration)
 * @since 2019-01-11
 */
public class QPoller<K, V, CTX> implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(QPoller.class);
    protected final CTX context;
    private final QConsumer<K, V> consumer;
    private QRecordHandler<K, V, CTX> recordHandler;
    private QErrorHandler<K, V, CTX> errorHandler;

    private long pollingTimeout = 100L;
    private long pollingIdle = 100L;

    private boolean logEveryRecord = false;
    private boolean logFailedRecord = false;

    private volatile boolean shouldStop;

    /**
     * 构造队列轮询器。
     *
     * @param consumer 消费者。
     * @param context  用户自定义上下文。
     * @author manbaum
     * @since 2019-01-11
     */
    public QPoller(QConsumer<K, V> consumer, CTX context) {
        this.consumer = consumer;
        this.context = context;
        this.shouldStop = false;
    }

    /**
     * 获得消息处理器。
     *
     * @return 消息处理器。
     * @author manbaum
     * @since 2019-01-11
     */
    public QRecordHandler<K, V, CTX> getRecordHandler() {
        return recordHandler;
    }

    /**
     * 设置消息处理器。
     *
     * @param recordHandler 消息处理器。
     * @author manbaum
     * @since 2019-01-11
     */
    public void setRecordHandler(QRecordHandler<K, V, CTX> recordHandler) {
        this.recordHandler = recordHandler;
    }

    /**
     * 获得出错处理器。
     *
     * @return 出错处理器。
     * @author manbaum
     * @since 2019-01-11
     */
    public QErrorHandler<K, V, CTX> getErrorHandler() {
        return errorHandler;
    }

    /**
     * 设置出错处理器。
     *
     * @param errorHandler 出错处理器。
     * @author manbaum
     * @since 2019-01-11
     */
    public void setErrorHandler(QErrorHandler<K, V, CTX> errorHandler) {
        this.errorHandler = errorHandler;
    }

    /**
     * 获得轮询超时时长。
     *
     * @return 轮询超时时长，单位为毫秒(ms)。
     * @author manbaum
     * @since 2019-01-11
     */
    public long getPollingTimeout() {
        return pollingTimeout;
    }

    /**
     * 设置轮询超时时长。
     *
     * @param timeout 轮询超时时长，单位为毫秒(ms)。
     * @author manbaum
     * @since 2019-01-11
     */
    public void setPollingTimeout(long timeout) {
        this.pollingTimeout = timeout;
    }

    /**
     * 获得轮询间隔时长。
     *
     * @return 轮询间隔时长，单位为毫秒(ms)。
     * @author manbaum
     * @since 2019-01-11
     */
    public long getPollingIdle() {
        return pollingIdle;
    }

    /**
     * 设置轮询间隔时长。
     *
     * @param pollingIdle 轮询间隔时长，单位为毫秒(ms)。
     * @author manbaum
     * @since 2019-01-11
     */
    public void setPollingIdle(long pollingIdle) {
        this.pollingIdle = pollingIdle;
    }

    /**
     * 是否在日志中输出每条记录。
     *
     * @return 若设置了在日志中输出每条记录则返回 <code>true</code>，否则返回 <code>false</code>。
     * @author manbaum
     * @since 2019-01-11
     */
    public boolean isLogEveryRecord() {
        return logEveryRecord;
    }

    /**
     * 设置是否在日志中输出每条记录。
     *
     * @param logEveryRecord <code>true</code> 则在日志中输出每条记录，否则为 <code>false</code>。
     * @author manbaum
     * @since 2019-01-11
     */
    public void setLogEveryRecord(boolean logEveryRecord) {
        this.logEveryRecord = logEveryRecord;
    }

    /**
     * 是否在日志中输出处理出错的记录。
     *
     * @return 若设置了在日志中输出处理出错的记录则返回 <code>true</code>，否则返回 <code>false</code>。
     * @author manbaum
     * @since 2019-01-11
     */
    public boolean isLogFailedRecord() {
        return logFailedRecord;
    }

    /**
     * 设置是否在日志中输出处理出错的记录。
     *
     * @param logFailedRecord <code>true</code> 则在日志中输出处理出错的记录，否则为 <code>false</code>。
     * @author manbaum
     * @since 2019-01-11
     */
    public void setLogFailedRecord(boolean logFailedRecord) {
        this.logFailedRecord = logFailedRecord;
    }

    /**
     * 要求结束轮询，{@link #run()} 方法体面结束。
     *
     * @author manbaum
     * @since 2019-01-11
     */
    public void stop() {
        shouldStop = true;
    }

    /**
     * 调用记录处理器处理记录。
     *
     * <p>若记录处理器执行过程中出现异常，将调用出错处理器处理。</p>
     *
     * @param record 待处理记录。
     * @author manbaum
     * @since 2019-01-11
     */
    private void handleRecord(QConsumerRecord<K, V> record) {
        try {
            if (logEveryRecord) {
                logger.info(record.toString());
            }
            recordHandler.process(record, context);
        } catch (Exception ex) {
            handleError(record, ex);
        }
    }

    /**
     * 调用出错处理器处理异常。
     *
     * <p>若异常处理器在执行过程中又出现异常，则该异常在被记录到日志中后忽略。</p>
     *
     * @param record    当期处理的记录。
     * @param exception 发生的异常。
     * @author manbaum
     * @since 2019-01-11
     */
    private void handleError(QConsumerRecord<K, V> record, Exception exception) {
        try {
            errorHandler.process(exception, record, context, consumer);
        } catch (Exception ex) {
            logger.warn("ignored.exception", ex);
            if (logFailedRecord) {
                logger.error(record.toString());
            }
        }
    }

    /**
     * 根据轮询间隔时间设置，使当前线程进入睡眠。
     *
     * <p>若线程睡眠期间发生 <code>java.lang.InterruptedException</code> 异常，
     * 则睡眠提取结束，该异常在被记录到日志中后忽略。</p>
     *
     * @author manbaum
     * @since 2019-01-11
     */
    private void sleep() {
        try {
            Thread.sleep(pollingIdle);
        } catch (InterruptedException ex) {
            logger.warn("ignored.exception", ex);
        }
    }

    /**
     * 钩子方法，在记录集处理前被调用。当前实现为空。
     *
     * <p>此方法不能产生异常，否则将导致轮询异常结束。</p>
     *
     * @param records 待处理的记录集。
     * @author manbaum
     * @since 2019-01-11
     */
    protected void batchBegin(QConsumerRecords<K, V> records) {
    }

    /**
     * 钩子方法，在记录集处理完成后被调用。当前实现为空。
     *
     * <p>此方法不能产生异常，否则将导致轮询异常结束。</p>
     *
     * @param records 已被处理完的记录集。
     * @author manbaum
     * @since 2019-01-11
     */
    protected void batchEnd(QConsumerRecords<K, V> records) {
    }

    /**
     * 轮询处理方法。
     *
     * <p>要求记录处理器以及出错处理器不能为空，
     * 否则将抛出 <code>java.lang.NullPointerException</code> 异常，然后处理结束。</p>
     *
     * <p>轮询逻辑如下：</p>
     * <ol>
     * <li>若收到结束轮询请求，则结束轮询并返回，否则继续；</li>
     * <li>调用 {@link QConsumer#poll(Duration)} 方法获得记录集；</li>
     * <li>若记录集为空，则根据轮询间隔时间设置，进入睡眠等待，睡眠结束后回到第 1 步；</li>
     * <li>若记录集不为空，则进入如下子流程：
     * <ol>
     * <li>调用记录集处理前钩子函数 {@link #batchBegin(QConsumerRecords)}；</li>
     * <li>针对每条记录，调用记录处理器进行处理；如果处理过程中出错，则调用出错处理器处理；</li>
     * <li>调用 {@link QConsumer#commitSync()} 提交记录读取指针；</li>
     * <li>调用记录集处理后钩子函数 {@link #batchEnd(QConsumerRecords)}；</li>
     * </ol>
     * </li>
     * <li>循环回到第 1 步。</li>
     * </ol>
     *
     * @author manbaum
     * @since 2019-01-11
     */
    @Override
    public void run() {
        if (recordHandler == null || errorHandler == null) {
            RuntimeException ex = new NullPointerException("poller.recordHandler.undefined");
            logger.error("Poller Abort!", ex);
            throw ex;
        }
        final Duration duration = Duration.ofMillis(pollingTimeout);
        while (!shouldStop) {
            final QConsumerRecords<K, V> records = consumer.poll(duration);
            if (records != null && !records.isEmpty()) {
                batchBegin(records);
                records.iterator().forEachRemaining(this::handleRecord);
                consumer.commitSync();
                batchEnd(records);
            } else {
                if (pollingIdle > 0) sleep();
            }
        }
    }
}
