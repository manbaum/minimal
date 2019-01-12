package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QProducerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class KafkaQProducerRecord.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQProducerRecord<K, V> implements QProducerRecord<K, V>, Serializable {

    private final ProducerRecord<K, V> record;

    public KafkaQProducerRecord(ProducerRecord<K, V> record) {
        this.record = record;
    }

    @Override
    public String topic() {
        return record.topic();
    }

    @Override
    public Integer partition() {
        return record.partition();
    }

    @Override
    public Long timestamp() {
        return record.timestamp();
    }

    @Override
    public K key() {
        return record.key();
    }

    @Override
    public V value() {
        return record.value();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KafkaQProducerRecord<?, ?> that = (KafkaQProducerRecord<?, ?>) o;
        return Objects.equals(record, that.record);
    }

    @Override
    public int hashCode() {
        return Objects.hash(record);
    }

    @Override
    public String toString() {
        return "KafkaQProducerRecord{" +
                "record=" + record +
                '}';
    }
}
