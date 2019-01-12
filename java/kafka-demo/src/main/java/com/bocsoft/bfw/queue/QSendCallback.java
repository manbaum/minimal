package com.bocsoft.bfw.queue;

/**
 * Interface QSendCallback.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
@FunctionalInterface
public interface QSendCallback {

    void onCompletion(QRecordMetadata qMetadata, Exception exception);
}
