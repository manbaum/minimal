package com.bocsoft.bfw.queue;

/**
 * Class QProducerRecord.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QProducerRecord<K, V> {

    String topic();

    Integer partition();

    Long timestamp();

    K key();

    V value();
}
