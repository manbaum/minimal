package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QConsumerFactory;
import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QTopicPartition;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.util.Collections;
import java.util.Properties;

/**
 * Class KafkaQConsumerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public class KafkaQConsumerFactory<K, V> implements QConsumerFactory<K, V> {

    @Override
    public QConsumer<K, V> create(Properties props, QTopicPartition qPartition) {
        final KafkaConsumer<K, V> consumer = new KafkaConsumer<K, V>(props);
        consumer.assign(Collections.singletonList(KafkaQUnwrapper.of(qPartition)));
        return new KafkaQConsumer<>(consumer, qPartition);
    }
}
