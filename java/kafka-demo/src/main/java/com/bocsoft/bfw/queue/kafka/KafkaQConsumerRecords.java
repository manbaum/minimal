package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QConsumerRecords;
import com.bocsoft.bfw.queue.tools.MappableIterator;
import org.apache.kafka.clients.consumer.ConsumerRecords;

import java.util.Iterator;

/**
 * Class KafkaQConsumerRecords.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQConsumerRecords<K, V> implements QConsumerRecords<K, V> {

    private final ConsumerRecords<K, V> records;

    public KafkaQConsumerRecords(ConsumerRecords<K, V> records) {
        this.records = records;
    }

    @Override
    public int count() {
        return records.count();
    }

    @Override
    public boolean isEmpty() {
        return records.isEmpty();
    }

    @Override
    public Iterator<QConsumerRecord<K, V>> iterator() {
        return MappableIterator.map(records.iterator(), KafkaQWrapper::of);
    }
}
