package com.bocsoft.bfw.queue;

import java.util.Properties;

/**
 * Class QProducerFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QProducerFactory<K, V> {

    QProducer<K, V> create(Properties props);
}
