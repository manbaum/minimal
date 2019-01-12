package com.bocsoft.bfw.queue;

/**
 * Class QOffsetAndMetadata.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QOffsetAndMetadata {

    Long offset();

    String metadata();
}
