package com.bocsoft.bfw.queue;

import java.time.Duration;

/**
 * 队列消息记录。通常由 {@link QConsumer#poll(Duration)} 方法产生。
 *
 * <p></p>
 *
 * @author manbaum
 * @see QConsumer#poll(Duration)
 * @see QConsumerRecords
 * @since 2019-01-09
 */
public interface QConsumerRecord<K, V> {

    /**
     * 获得消息主题名称。
     *
     * @return 主题名称。
     * @author manbaum
     * @since 2019-01-09
     */
    String topic();

    /**
     * 获得消息所在分区号。
     *
     * @return 分区号。
     * @author manbaum
     * @since 2019-01-09
     */
    Integer partition();

    /**
     * 获得消息创建时的时间戳。
     *
     * @return 时间戳。
     * @author manbaum
     * @since 2019-01-09
     */
    Long timestamp();

    /**
     * 获得消息键值。
     *
     * @return 键值。
     * @author manbaum
     * @since 2019-01-09
     */
    K key();

    /**
     * 获得消息值。
     *
     * @return 消息值。
     * @author manbaum
     * @since 2019-01-09
     */
    V value();
}
