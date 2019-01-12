package com.bocsoft.bfw.queue;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class SimpleQTopicPartition.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class SimpleQTopicPartition implements QTopicPartition, Serializable {

    private final String topic;
    private final Integer partition;

    public SimpleQTopicPartition(String topic, Integer partition) {
        this.topic = topic;
        this.partition = partition;
    }

    public SimpleQTopicPartition(String topic) {
        this(topic, null);
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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SimpleQTopicPartition that = (SimpleQTopicPartition) o;
        return Objects.equals(topic, that.topic) &&
                Objects.equals(partition, that.partition);
    }

    @Override
    public int hashCode() {
        return Objects.hash(topic, partition);
    }

    @Override
    public String toString() {
        return "SimpleQTopicPartition{" +
                "topic='" + topic + '\'' +
                ", partition=" + partition +
                '}';
    }
}
