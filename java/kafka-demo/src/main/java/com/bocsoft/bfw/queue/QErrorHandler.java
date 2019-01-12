package com.bocsoft.bfw.queue;

/**
 * Interface QErrorHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QErrorHandler<K, V> {

    void process(QConsumer<K, V> consumer, QConsumerRecord<K, V> record, Exception exception);
}
