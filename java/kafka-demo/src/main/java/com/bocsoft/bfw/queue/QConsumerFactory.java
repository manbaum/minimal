package com.bocsoft.bfw.queue;

/**
 * Interface QConsumerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QConsumerFactory<K, V> {

    QConsumer<K, V> create(String topic, Integer partition);
}
