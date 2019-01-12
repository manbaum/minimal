package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QOffsetCommitCallback;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.clients.consumer.OffsetCommitCallback;
import org.apache.kafka.common.TopicPartition;

import java.util.Map;

/**
 * Class KafkaOffsetCommitCallbackAdapter.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public class KafkaOffsetCommitCallbackAdapter implements OffsetCommitCallback {

    private final QOffsetCommitCallback callback;

    public KafkaOffsetCommitCallbackAdapter(QOffsetCommitCallback callback) {
        this.callback = callback;
    }

    @Override
    public void onComplete(Map<TopicPartition, OffsetAndMetadata> offsets, Exception exception) {
        callback.onComplete(KafkaQWrapper.of(offsets), exception);
    }
}
