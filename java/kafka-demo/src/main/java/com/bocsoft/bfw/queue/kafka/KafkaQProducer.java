package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QProducer;
import com.bocsoft.bfw.queue.QRecordMetadata;
import com.bocsoft.bfw.queue.QSendCallback;
import com.bocsoft.bfw.queue.tools.MappableFuture;
import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.time.Duration;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * Class KafkaQProducer.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQProducer<K, V> implements QProducer<K, V> {

    private final KafkaProducer<K, V> producer;
    private final String topic;
    private final Integer partition;

    public KafkaQProducer(KafkaProducer<K, V> producer, String topic, Integer partition) {
        this.producer = producer;
        this.topic = topic;
        this.partition = partition;
    }

    @Override
    public String topic() {
        return topic;
    }

    @Override
    public Integer partition() {
        return partition;
    }

    @Override
    public void close() {
        producer.close();
    }

    @Override
    public void close(Duration timeout) {
        producer.close(timeout.toMillis(), TimeUnit.MILLISECONDS);
    }

    @Override
    public void flush() {
        producer.flush();
    }

    @Override
    public Future<QRecordMetadata> send(K key, V value) {
        final ProducerRecord<K, V> record = new ProducerRecord<>(topic, partition, key, value);
        return MappableFuture.map(producer.send(record), KafkaQWrapper::of);
    }

    @Override
    public Future<QRecordMetadata> send(K key, V value, QSendCallback qCallback) {
        final ProducerRecord<K, V> record = new ProducerRecord<>(topic, partition, key, value);
        final Callback callback = KafkaQUnwrapper.of(qCallback);
        return MappableFuture.map(producer.send(record, callback), KafkaQWrapper::of);
    }
}
