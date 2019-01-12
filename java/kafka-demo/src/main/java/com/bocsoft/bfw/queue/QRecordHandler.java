package com.bocsoft.bfw.queue;

/**
 * Interface QRecordHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QRecordHandler<K, V, CTX> {

    void process(QConsumerRecord<K, V> record, CTX context);
}
