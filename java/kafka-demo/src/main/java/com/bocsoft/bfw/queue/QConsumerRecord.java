package com.bocsoft.bfw.queue;

/**
 * Class QConsumerRecord.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QConsumerRecord<K, V> {

    String topic();

    Integer partition();

    Long timestamp();

    K key();

    V value();
}
