package com.bocsoft.bfw.queue.boot;

/**
 * Interface QPartitioner.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QPartitioner<K, V> {

    int hash(K key, V value);
}
