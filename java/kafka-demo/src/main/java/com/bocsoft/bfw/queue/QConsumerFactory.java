package com.bocsoft.bfw.queue;

import java.util.Properties;

/**
 * Interface QConsumerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QConsumerFactory<K, V> {

    QConsumer<K, V> create(Properties props, QTopicPartition qPartition);

    default QConsumer<K, V> create(Properties props, String topic, Integer partition) {
        return create(props, new SimpleQTopicPartition(topic, partition));
    }

    default QConsumer<K, V> create(Properties props, String topic) {
        return create(props, new SimpleQTopicPartition(topic));
    }
}
