package com.bocsoft.bfw.queue;

/**
 * Interface QErrorHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QErrorHandler<K, V, CTX> {

    void process(Exception exception, QConsumerRecord<K, V> record, CTX context, QConsumer<K, V> consumer);
}
