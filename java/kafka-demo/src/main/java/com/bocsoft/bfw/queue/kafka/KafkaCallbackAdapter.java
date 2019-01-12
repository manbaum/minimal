package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QSendCallback;
import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.RecordMetadata;

/**
 * Class KafkaCallbackAdapter.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public class KafkaCallbackAdapter implements Callback {

    private final QSendCallback callback;

    public KafkaCallbackAdapter(QSendCallback callback) {
        this.callback = callback;
    }

    @Override
    public void onCompletion(RecordMetadata metadata, Exception exception) {
        callback.onCompletion(KafkaQWrapper.of(metadata), exception);
    }
}
