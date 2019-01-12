package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QTopicPartition;
import org.apache.kafka.common.TopicPartition;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class KafkaQTopicPartition.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQTopicPartition implements QTopicPartition, Serializable {

    private final TopicPartition partition;

    public KafkaQTopicPartition(TopicPartition partition) {
        this.partition = partition;
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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KafkaQTopicPartition that = (KafkaQTopicPartition) o;
        return Objects.equals(partition, that.partition);
    }

    @Override
    public int hashCode() {
        return Objects.hash(partition);
    }

    @Override
    public String toString() {
        return "KafkaQTopicPartition{" +
                "partition=" + partition +
                '}';
    }
}
