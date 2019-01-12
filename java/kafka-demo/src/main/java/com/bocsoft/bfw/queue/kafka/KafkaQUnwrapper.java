package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QOffsetCommitCallback;
import com.bocsoft.bfw.queue.QSendCallback;
import com.bocsoft.bfw.queue.QTopicPartition;
import org.apache.kafka.clients.consumer.OffsetCommitCallback;
import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.common.TopicPartition;

/**
 * Class KafkaQUnwrapper.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class KafkaQUnwrapper {

    private KafkaQUnwrapper() {
    }

    public static Callback of(QSendCallback qCallback) {
        return new KafkaCallbackAdapter(qCallback);
    }

    public static OffsetCommitCallback of(QOffsetCommitCallback qCallback) {
        return new KafkaOffsetCommitCallbackAdapter(qCallback);
    }

    public static TopicPartition of(QTopicPartition qPartition) {
        final int partition = qPartition.partition() != null ? qPartition.partition() : 0;
        return new TopicPartition(qPartition.topic(), partition);
    }
}
