package com.bocsoft.bfw.queue;

import java.util.Map;

/**
 * Interface QOffsetCommitCallback.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QOffsetCommitCallback {

    void onComplete(Map<QTopicPartition, QOffsetAndMetadata> qOffsets, Exception exception);
}
