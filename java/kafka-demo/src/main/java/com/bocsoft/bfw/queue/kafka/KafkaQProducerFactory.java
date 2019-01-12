package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.HasQConfig;
import com.bocsoft.bfw.queue.QProducer;
import com.bocsoft.bfw.queue.QProducerFactory;
import org.apache.kafka.clients.producer.KafkaProducer;

/**
 * Class KafkaQProducerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQProducerFactory<K, V> extends HasQConfig implements QProducerFactory<K, V> {

    @Override
    public QProducer<K, V> create(String topic, Integer partition) {
        return new KafkaQProducer<>(new KafkaProducer<>(properties()), topic, partition);
    }
}
