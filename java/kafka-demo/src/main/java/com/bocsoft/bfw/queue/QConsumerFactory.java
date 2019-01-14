package com.bocsoft.bfw.queue;

/**
 * 队列消费者工厂接口，用来生成消费者 {@link QConsumer} 实现对象。
 *
 * <p></p>
 *
 * @author manbaum
 * @see QConsumer
 * @since 2019-01-09
 */
public interface QConsumerFactory<K, V> {

    /**
     * 创建处理给定主题及分区下队列消息的消费者。
     *
     * @param topic     主题名称。
     * @param partition 分区号。
     * @return 消费者。
     * @author manbaum
     * @since 2019-01-09
     */
    QConsumer<K, V> create(String topic, Integer partition);

    /**
     * 创建处理给定主题下队列消息的消费者。分区由消息系统自行设定。
     *
     * @param topic 主题名称。
     * @return 消费者。
     * @author manbaum
     * @since 2019-01-09
     */
    default QConsumer<K, V> create(String topic) {
        return create(topic, null);
    }
}
