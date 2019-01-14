package com.bocsoft.bfw.queue;

import java.time.Duration;
import java.util.concurrent.Future;

/**
 * 消息生产者接口。其实现对象通常由 {@link QProducerFactory} 创建生成。
 *
 * <p></p>
 *
 * <p>一个消息生产者，可生产一个队列中某消息主题下某个分区下的消息，
 * 也可以生产某消息主题下所有分区下的消息，使用消息键值实现对消息的自动分区。</p>
 *
 * <p></p>
 *
 * <p>关于实现消息自动分区，参见 {@link QPartitioner}。</p>
 *
 * <p></p>
 *
 * @author manbaum
 * @since 2019-01-09
 */
public interface QProducer<K, V> {

    /**
     * 消息所在的主题。
     *
     * @return 主题名称。
     * @author manbaum
     * @since 2019-01-09
     */
    String topic();

    /**
     * 消息所在的分区。
     *
     * @return 分区号。
     * @author manbaum
     * @since 2019-01-09
     */
    Integer partition();

    /**
     * 关闭生产者。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void close();

    /**
     * 在给定超时时长下等待生产者关闭。
     *
     * @param timeout 超时时长。
     * @author manbaum
     * @since 2019-01-09
     */
    void close(Duration timeout);

    /**
     * 刷新生产者缓冲区，确保缓冲区中所有待发送消息都发送完成。
     *
     * @author manbaum
     * @since 2019-01-09
     */
    void flush();

    /**
     * 发送消息。
     *
     * @param key   消息键值。
     * @param value 消息值。
     * @return <code>Future</code> 对象。
     * @author manbaum
     * @since 2019-01-09
     */
    Future<QRecordMetadata> send(K key, V value);

    /**
     * 发送消息，当完成时回调给定函数。
     *
     * @param key       消息键值。
     * @param value     消息值。
     * @param qCallback 回调函数。
     * @return <code>Future</code> 对象。
     * @author manbaum
     * @since 2019-01-09
     */
    Future<QRecordMetadata> send(K key, V value, QSendCallback qCallback);
}
