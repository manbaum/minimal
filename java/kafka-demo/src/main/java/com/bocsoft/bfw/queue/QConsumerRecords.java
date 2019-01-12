package com.bocsoft.bfw.queue;

import java.util.List;
import java.util.Set;

/**
 * Class QConsumerRecords.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QConsumerRecords<K, V> extends Iterable<QConsumerRecord<K, V>> {

    int count();

    boolean isEmpty();

    Set<QTopicPartition> partitions();

    Iterable<QConsumerRecord<K, V>> records(String topic);

    List<QConsumerRecord<K, V>> records(QTopicPartition qPartition);
}
