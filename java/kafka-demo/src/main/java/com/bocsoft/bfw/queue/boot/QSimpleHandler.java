package com.bocsoft.bfw.queue.boot;

import com.bocsoft.bfw.queue.QConsumerRecord;

/**
 * Interface QSimpleHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QSimpleHandler<K, V> extends QHandler<K, V> {

    void process(K key, V value);

    @Override
    default void process(QConsumerRecord<K, V> record) {
        process(record.key(), record.value());
    }
}
