package com.bocsoft.bfw.queue;

/**
 * 消息处理器接口。
 *
 * <p></p>
 *
 * <p>参见 {@link QPoller}。当消息集产生时，实现此接口的处理器被调用，用来处理每条消息。</p>
 *
 * <p></p>
 *
 * @author manbaum
 * @since 2019-01-11
 */
public interface QRecordHandler<K, V, CTX> {

    /**
     * 消息处理例程。
     *
     * @param record  待处理记录。
     * @param context 用户自定义的上下文。
     * @author manbaum
     * @since 2019-01-11
     */
    void process(QConsumerRecord<K, V> record, CTX context);
}
