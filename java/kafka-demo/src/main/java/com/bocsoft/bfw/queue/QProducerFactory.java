package com.bocsoft.bfw.queue;

/**
 * 消息生产者工厂接口。用来生成生产者 {@link QConsumer} 实现对象。
 *
 * <p></p>
 *
 * @author manbaum
 * @since 2019-01-09
 */
public interface QProducerFactory<K, V> {

    /**
     * 创建给定主题和分区号的生产者。
     *
     * @param topic     主题名称。
     * @param partition 分区号。
     * @return 消息生产者。
     * @author manbaum
     * @since 2019-01-09
     */
    QProducer<K, V> create(String topic, Integer partition);

    /**
     * 创建给定主题的消息生产者。
     *
     * @param topic 主题名称。
     * @return 消息生产者。
     * @author manbaum
     * @since 2019-01-09
     */
    default QProducer<K, V> create(String topic) {
        return create(topic, null);
    }
}
