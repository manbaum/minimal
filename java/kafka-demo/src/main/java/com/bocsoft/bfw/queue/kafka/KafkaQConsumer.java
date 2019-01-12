package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerRecords;
import com.bocsoft.bfw.queue.QOffsetCommitCallback;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;

import java.time.Duration;
import java.util.Collections;

/**
 * Class KafkaQConsumer.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public class KafkaQConsumer<K, V> implements QConsumer<K, V> {

    private final KafkaConsumer<K, V> consumer;
    private final TopicPartition partition;

    public KafkaQConsumer(KafkaConsumer<K, V> consumer, String topic, Integer partition) {
        this.consumer = consumer;
        this.partition = new TopicPartition(topic, partition);
        // 绑定 topic 和 partition
        this.consumer.assign(Collections.singleton(this.partition));
    }

    @Override
    public String topic() {
        return partition.topic();
    }

    @Override
    public Integer partition() {
        return partition.partition();
    }

    @Override
    public void close() {
        consumer.close();
    }

    @Override
    public void close(Duration timeout) {
        consumer.close(timeout);
    }

    @Override
    public QConsumerRecords<K, V> poll(Duration timeout) {
        return KafkaQWrapper.of(consumer.poll(timeout));
    }

    @Override
    public void seek(long offset) {
        consumer.seek(partition, offset);
    }

    @Override
    public void seekToBegin() {
        consumer.seekToBeginning(Collections.singletonList(partition));
    }

    @Override
    public void seekToEnd() {
        consumer.seekToEnd(Collections.singletonList(partition));
    }

    @Override
    public void pause() {
        consumer.pause(Collections.singletonList(partition));
    }

    @Override
    public void resume() {
        consumer.resume(Collections.singletonList(partition));
    }

    @Override
    public void commitSync() {
        consumer.commitSync();
    }

    @Override
    public void commitSync(Duration timeout) {
        consumer.commitSync(timeout);
    }

    @Override
    public void commitAsync() {
        consumer.commitAsync();
    }

    @Override
    public void commitAsync(QOffsetCommitCallback qCallback) {
        consumer.commitAsync(KafkaQUnwrapper.of(qCallback));
    }
}
