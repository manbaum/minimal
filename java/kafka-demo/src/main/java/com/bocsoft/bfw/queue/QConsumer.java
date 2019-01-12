package com.bocsoft.bfw.queue;

import java.time.Duration;

/**
 * Interface QConsumer.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QConsumer<K, V> {

    String topic();

    Integer partition();

    void close();

    void close(Duration timeout);

    QConsumerRecords<K, V> poll(Duration timeout);

    void seek(long offset);

    void seekToBegin();

    void seekToEnd();

    void pause();

    void resume();

    void commitSync();

    void commitSync(Duration timeout);

    void commitAsync();

    void commitAsync(QOffsetCommitCallback qCallback);
}
