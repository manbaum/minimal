package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.record.TimestampType;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class KafkaQConsumerRecord.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQConsumerRecord<K, V> implements QConsumerRecord<K, V>, Serializable {

    private final ConsumerRecord<K, V> record;

    public KafkaQConsumerRecord(ConsumerRecord<K, V> record) {
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
        return record.timestampType() == TimestampType.CREATE_TIME ? record.timestamp() : null;
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
        KafkaQConsumerRecord<?, ?> that = (KafkaQConsumerRecord<?, ?>) o;
        return Objects.equals(record, that.record);
    }

    @Override
    public int hashCode() {
        return Objects.hash(record);
    }

    @Override
    public String toString() {
        return "KafkaQConsumerRecord{" +
                "record=" + record +
                '}';
    }
}
