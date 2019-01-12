package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QProducer;
import com.bocsoft.bfw.queue.QProducerRecord;
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

    public KafkaQProducer(KafkaProducer<K, V> producer) {
        this.producer = producer;
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
    public Future<QRecordMetadata> send(QProducerRecord<K, V> qRecord) {
        final ProducerRecord<K, V> record = KafkaQUnwrapper.of(qRecord);
        return MappableFuture.map(producer.send(record), KafkaQWrapper::of);
    }

    @Override
    public Future<QRecordMetadata> send(QProducerRecord<K, V> qRecord, QSendCallback qCallback) {
        final ProducerRecord<K, V> record = KafkaQUnwrapper.of(qRecord);
        final Callback callback = KafkaQUnwrapper.of(qCallback);
        return MappableFuture.map(producer.send(record, callback), KafkaQWrapper::of);
    }
}
