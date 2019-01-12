package com.bocsoft.bfw.queue;

/**
 * Class QProducerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QProducerFactory<K, V> {

    QProducer<K, V> create(String topic, Integer partition);

    default QProducer<K, V> create(String topic) {
        return create(topic, null);
    }
}
