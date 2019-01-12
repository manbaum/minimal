package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.HasQConfig;
import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerFactory;
import org.apache.kafka.clients.consumer.KafkaConsumer;

/**
 * Class KafkaQConsumerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public class KafkaQConsumerFactory<K, V> extends HasQConfig implements QConsumerFactory<K, V> {

    @Override
    public QConsumer<K, V> create(String topic, Integer partition) {
        return new KafkaQConsumer<>(new KafkaConsumer<K, V>(properties()), topic, partition);
    }
}
