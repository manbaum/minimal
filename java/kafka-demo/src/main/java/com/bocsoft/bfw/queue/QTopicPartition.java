package com.bocsoft.bfw.queue;

/**
 * Class QTopicPartition.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface QTopicPartition {

    String topic();

    Integer partition();
}
