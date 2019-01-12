package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QOffsetAndMetadata;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;

import java.io.Serializable;
import java.util.Objects;

/**
 * Class KafkaQOffsetAndMetadata.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQOffsetAndMetadata implements QOffsetAndMetadata, Serializable {

    private final OffsetAndMetadata offsetAndMeta;

    public KafkaQOffsetAndMetadata(OffsetAndMetadata offsetAndMeta) {
        this.offsetAndMeta = offsetAndMeta;
    }

    @Override
    public Long offset() {
        return offsetAndMeta.offset();
    }

    @Override
    public String metadata() {
        return offsetAndMeta.metadata();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KafkaQOffsetAndMetadata that = (KafkaQOffsetAndMetadata) o;
        return Objects.equals(offsetAndMeta, that.offsetAndMeta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(offsetAndMeta);
    }

    @Override
    public String toString() {
        return "KafkaQOffsetAndMetadata{" +
                "offsetAndMeta=" + offsetAndMeta +
                '}';
    }
}
