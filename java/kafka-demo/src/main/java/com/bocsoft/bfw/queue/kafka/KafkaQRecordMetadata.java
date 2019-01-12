package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QRecordMetadata;
import org.apache.kafka.clients.producer.RecordMetadata;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class KafkaQRecordMetadata.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQRecordMetadata implements QRecordMetadata, Serializable {

    private final RecordMetadata metadata;

    public KafkaQRecordMetadata(RecordMetadata metadata) {
        this.metadata = metadata;
    }

    @Override
    public String topic() {
        return metadata.topic();
    }

    @Override
    public Integer partition() {
        return metadata.partition();
    }

    @Override
    public Long offset() {
        return metadata.hasOffset() ? metadata.offset() : null;
    }

    @Override
    public Long timestamp() {
        return metadata.hasTimestamp() ? metadata.timestamp() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KafkaQRecordMetadata that = (KafkaQRecordMetadata) o;
        return Objects.equals(metadata, that.metadata);
    }

    @Override
    public int hashCode() {
        return Objects.hash(metadata);
    }

    @Override
    public String toString() {
        return "KafkaQRecordMetadata{" +
                "metadata=" + metadata +
                '}';
    }
}
