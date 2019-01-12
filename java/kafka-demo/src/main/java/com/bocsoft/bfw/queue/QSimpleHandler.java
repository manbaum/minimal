package com.bocsoft.bfw.queue;

/**
 * Interface QSimpleHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QSimpleHandler<K, V> extends QRecordHandler<K, V> {

    void process(K key, V value);

    @Override
    default void process(QConsumerRecord<K, V> record) {
        process(record.key(), record.value());
    }
}
