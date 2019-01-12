package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QTopicPartition;
import com.bocsoft.bfw.queue.tools.CollectionMapper;
import com.bocsoft.bfw.queue.tools.MappableIterable;
import com.bocsoft.bfw.queue.tools.MappableIterator;
import com.bocsoft.bfw.queue.QConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.TopicPartition;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

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

    @Override
    public Set<QTopicPartition> partitions() {
        return CollectionMapper.map(records.partitions(), KafkaQWrapper::of);
    }

    @Override
    public Iterable<QConsumerRecord<K, V>> records(String topic) {
        return MappableIterable.map(records.records(topic), KafkaQWrapper::of);
    }

    @Override
    public List<QConsumerRecord<K, V>> records(QTopicPartition qPartition) {
        final TopicPartition partition = KafkaQUnwrapper.of(qPartition);
        return CollectionMapper.map(records.records(partition), KafkaQWrapper::of);
    }
}
