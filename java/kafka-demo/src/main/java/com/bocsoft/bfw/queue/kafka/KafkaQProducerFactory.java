package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QProducerFactory;
import com.bocsoft.bfw.queue.QProducer;
import org.apache.kafka.clients.producer.KafkaProducer;

import java.util.Properties;

/**
 * Class KafkaQProducerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQProducerFactory<K, V> implements QProducerFactory<K, V> {

    @Override
    public QProducer<K, V> create(Properties props) {
        final KafkaProducer<K, V> producer = new KafkaProducer<>(props);
        return new KafkaQProducer<>(producer);
    }
}
