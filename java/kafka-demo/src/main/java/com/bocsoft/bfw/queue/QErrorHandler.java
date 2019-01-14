package com.bocsoft.bfw.queue;

/**
 * 消息处理出错处理接口。
 *
 * <p></p>
 *
 * <p>参见 {@link QPoller}。当消息处理器 {@link QRecordHandler} 执行出现未捕获的异常时，实现此接口的出错处理器可被触发。</p>
 *
 * <p></p>
 *
 * @author manbaum
 * @see QPoller
 * @see QRecordHandler
 * @since 2019-01-11
 */
public interface QErrorHandler<K, V, CTX> {

    /**
     * 出错处理例程。
     *
     * @param exception 出现的异常。
     * @param record    正在被处理的记录。
     * @param context   用户自定义的上下文对象。
     * @param consumer  产生该记录的消费者。
     * @author manbaum
     * @since 2019-01-11
     */
    void process(Exception exception, QConsumerRecord<K, V> record, CTX context, QConsumer<K, V> consumer);
}
