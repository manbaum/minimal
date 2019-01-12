package com.bocsoft.bfw.queue;

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
}
