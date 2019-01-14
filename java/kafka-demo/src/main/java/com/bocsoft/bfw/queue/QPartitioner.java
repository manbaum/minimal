package com.bocsoft.bfw.queue;

/**
 * Interface QPartitioner.
 * <p>
 *
 * @author manbaum
 * @since Jan 14, 2019
 */
public interface QPartitioner<K, V> {

    int partition(String topic, int numberPartitions, K key, V value);
}
