package com.bocsoft.bfw.queue;

import java.time.Duration;

/**
 * 队列消费者接口。其实现对象通常使用 {@link QConsumerFactory} 来创建。
 *
 * <p></p>
 *
 * <p>一个消费者可以消费一个队列中某个主题的某个分区下的所有消息。</p>
 *
 * <p></p>
 *
 * <p>消费者可采用轮询的方式调用 {@link #poll(Duration)} 方法，
 * 获得消息记录集 {@link QConsumerRecords} 并逐一处理每条消息，
 * 处理完成后使用 {@link #commitSync()}
 * 或者 {@link #commitAsync()} 等方法提交读取指针。</p>
 *
 * <p></p>
 *
 * <p>工具类 {@link QPoller} 封装了这些基本的轮询逻辑，可供直接使用。</p>
 *
 * <p></p>
 *
 * @author manbaum
 * @see QConsumerFactory
 * @see QPoller
 * @since 2019-01-09
 */
public interface QConsumer<K, V> {

    /**
     * 获得当前消费的主题名称。实现类应该保证此值不为空。
     *
     * @return 主题名称。
     * @author manbaum
     * @since 2019-01-09
     */
    String topic();

    /**
     * 获得当前消费的分区号。无分区时可能为空。
     *
     * @return 分区号。
     * @author manbaum
     * @since 2019-01-09
     */
    Integer partition();

    /**
     * 关闭消费者。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void close();

    /**
     * 在给定的超时时间内，等待消费者关闭。
     *
     * @param timeout 超时时间。
     * @author manbaum
     * @since 2019-01-09
     */
    void close(Duration timeout);

    /**
     * 查询队列获得队列数据。一次轮询可能获得多条消息，返回为记录集。
     *
     * @param timeout 超时时间。
     * @return 队列数据记录集。
     * @author manbaum
     * @since 2019-01-09
     */
    QConsumerRecords<K, V> poll(Duration timeout);

    /**
     * 将队列读取指针移动到指定偏移量。
     *
     * @param offset 偏移量。
     * @author manbaum
     * @since 2019-01-09
     */
    void seek(long offset);

    /**
     * 将队列读取指针移动到队列首。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void seekToBegin();

    /**
     * 将队列读取指针移动到队列尾。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void seekToEnd();

    /**
     * 暂停队列消费。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void pause();

    /**
     * 恢复队列消费。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void resume();

    /**
     * 同步提交当前读取指针。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void commitSync();

    /**
     * 在给定超时时间内，等待提交当前读取指针。
     *
     * @param timeout 超时时间。
     * @author manbaum
     * @since 2019-01-09
     */
    void commitSync(Duration timeout);

    /**
     * 异步提交当前读取指针。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void commitAsync();

    /**
     * 异步提交当前读取指针，当提交成功或失败时调用给定回调函数。
     *
     * @param qCallback 回调函数。
     * @author manbaum
     * @since 2019-01-09
     */
    void commitAsync(QOffsetCommitCallback qCallback);
}
