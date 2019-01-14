package com.bocsoft.bfw.queue;

import java.time.Duration;

/**
 * 队列消息集接口。通常由 {@link QConsumer#poll(Duration)} 方法产生。
 *
 * <p></p>
 *
 * <p>一次轮询可能获得多条消息，因此返回记录集。
 * 记录集实现了 <code>java.lang.Iterable</code> 接口。</p>
 *
 * <p></p>
 *
 * @author manbaum
 * @since 2019-01-09
 */
public interface QConsumerRecords<K, V> extends Iterable<QConsumerRecord<K, V>> {

    /**
     * 获得消息数量。可能为零。
     *
     * @return 消息数量。
     * @author manbaum
     * @since 2019-01-09
     */
    int count();

    /**
     * 判断消息集是否为空。
     *
     * @return 若消息数为零则返回 <code>true</code>，否则返回 <code>false</code>。
     * @author manbaum
     * @since 2019-01-09
     */
    boolean isEmpty();
}
