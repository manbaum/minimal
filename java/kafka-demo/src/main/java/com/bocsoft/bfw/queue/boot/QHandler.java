package com.bocsoft.bfw.queue.boot;

import com.bocsoft.bfw.queue.QConsumerRecord;

/**
 * Interface QHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface QHandler<K, V> {

    void process(QConsumerRecord<K, V> record);
}
