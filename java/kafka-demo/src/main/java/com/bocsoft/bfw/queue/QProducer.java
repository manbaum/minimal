package com.bocsoft.bfw.queue;

import java.time.Duration;
import java.util.concurrent.Future;

/**
 * Interface QProducer.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QProducer<K, V> {

    void close();

    void close(Duration timeout);

    void flush();

    Future<QRecordMetadata> send(QProducerRecord<K, V> qRecord);

    Future<QRecordMetadata> send(QProducerRecord<K, V> qRecord, QSendCallback qCallback);
}
