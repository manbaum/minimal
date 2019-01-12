package com.bocsoft.bfw.queue.boot;

import com.bocsoft.bfw.queue.QConsumerRecord;

/**
 * Interface QErrorHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QErrorHandler<K, V> {

    void process(QConsumerRecord<K, V> record, Exception exception);
}
