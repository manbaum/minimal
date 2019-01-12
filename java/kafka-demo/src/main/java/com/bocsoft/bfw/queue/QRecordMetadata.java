package com.bocsoft.bfw.queue;

/**
 * Class QRecordMetadata.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QRecordMetadata {

    String topic();

    Integer partition();

    Long offset();

    Long timestamp();
}
