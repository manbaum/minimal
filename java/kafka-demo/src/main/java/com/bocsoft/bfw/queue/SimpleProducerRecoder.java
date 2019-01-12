package com.bocsoft.bfw.queue;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class SimpleProducerRecoder.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class SimpleProducerRecoder<K extends Serializable, V extends Serializable> implements QProducerRecord<K, V>, Serializable {

    private final String topic;
    private final Integer partition;
    private final Long timestamp;
    private final K key;
    private final V value;

    public SimpleProducerRecoder(String topic, Integer partition, Long timestamp, K key, V value) {
        this.topic = topic;
        this.partition = partition;
        this.timestamp = timestamp;
        this.key = key;
        this.value = value;
    }

    public SimpleProducerRecoder(String topic, Integer partition, K key, V value) {
        this(topic, partition, null, key, value);
    }

    public SimpleProducerRecoder(String topic, K key, V value) {
        this(topic, null, null, key, value);
    }

    public SimpleProducerRecoder(String topic, Integer partition, V value) {
        this(topic, partition, null, null, value);
    }

    public SimpleProducerRecoder(String topic, V value) {
        this(topic, null, null, null, value);
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
    public Long timestamp() {
        return timestamp;
    }

    @Override
    public K key() {
        return key;
    }

    @Override
    public V value() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SimpleProducerRecoder<?, ?> that = (SimpleProducerRecoder<?, ?>) o;
        return Objects.equals(topic, that.topic) &&
                Objects.equals(partition, that.partition) &&
                Objects.equals(timestamp, that.timestamp) &&
                Objects.equals(key, that.key) &&
                Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(topic, partition, timestamp, key, value);
    }

    @Override
    public String toString() {
        return "SimpleProducerRecoder{" +
                "topic='" + topic + '\'' +
                ", partition=" + partition +
                ", timestamp=" + timestamp +
                ", key=" + key +
                ", value=" + value +
                '}';
    }
}
