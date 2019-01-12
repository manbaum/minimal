package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QConsumerRecords;
import com.bocsoft.bfw.queue.QOffsetAndMetadata;
import com.bocsoft.bfw.queue.QRecordMetadata;
import com.bocsoft.bfw.queue.QTopicPartition;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;

import java.util.HashMap;
import java.util.Map;

/**
 * Class KafkaQWrapper.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQWrapper {

    private KafkaQWrapper() {
    }

    public static <K, V> QConsumerRecord<K, V> of(ConsumerRecord<K, V> record) {
        return new KafkaQConsumerRecord<>(record);
    }

    public static <K, V> QConsumerRecords<K, V> of(ConsumerRecords<K, V> records) {
        return new KafkaQConsumerRecords<>(records);
    }

    public static QOffsetAndMetadata of(OffsetAndMetadata offsetAndMeta) {
        return new KafkaQOffsetAndMetadata(offsetAndMeta);
    }

    public static QRecordMetadata of(RecordMetadata metadata) {
        return new KafkaQRecordMetadata(metadata);
    }

    public static QTopicPartition of(TopicPartition partition) {
        return new KafkaQTopicPartition(partition);
    }

    public static Map<QTopicPartition, QOffsetAndMetadata> of(Map<TopicPartition, OffsetAndMetadata> offsets) {
        final HashMap<QTopicPartition, QOffsetAndMetadata> map = new HashMap<>(offsets.size());
        for (TopicPartition partition : offsets.keySet()) {
            final QTopicPartition qPartition = KafkaQWrapper.of(partition);
            final QOffsetAndMetadata qOffsetAndMeta = KafkaQWrapper.of(offsets.get(partition));
            map.put(qPartition, qOffsetAndMeta);
        }
        return map;
    }
}
