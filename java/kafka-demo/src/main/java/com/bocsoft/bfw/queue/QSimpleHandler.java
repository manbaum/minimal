package com.bocsoft.bfw.queue;

/**
 * Interface QSimpleHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QSimpleHandler<K, V, CTX> extends QRecordHandler<K, V, CTX> {

    void process(K key, V value, CTX context);

    @Override
    default void process(QConsumerRecord<K, V> record, CTX context) {
        process(record.key(), record.value(), context);
    }
}
