package com.bocsoft.bfw.queue;

import org.springframework.beans.factory.FactoryBean;

/**
 * 简易生产者工厂 Bean。用于 Spring 配置中。
 * <p>
 *
 * @author manbaum
 * @since 2019-01-15
 */
public class SimpleQProducerFactoryBean<K, V> implements FactoryBean<QProducer<K, V>> {

    private QProducerFactory<K, V> factory;
    private String topic;
    private Integer partition;

    /**
     * 构造简易生产者工厂。
     *
     * @author manbaum
     * @since 2019-01-15
     */
    public SimpleQProducerFactoryBean() {
    }

    /**
     * 创建生产者对象。
     *
     * @return 生产者。
     * @throws Exception 创建失败时产生。
     * @author manbaum
     * @since 2019-01-15
     */
    @Override
    public QProducer<K, V> getObject() throws Exception {
        return factory.create(topic, partition);
    }

    /**
     * 生产者对象的类型。
     *
     * @return 返回 {@link QProducer}.class。
     * @author manbaum
     * @since 2019-01-15
     */
    @Override
    public Class<?> getObjectType() {
        return QProducer.class;
    }

    /**
     * 是否单例。
     *
     * @return 返回 <code>true</code>。
     * @author manbaum
     * @since 2019-01-15
     */
    @Override
    public boolean isSingleton() {
        return true;
    }

    /**
     * 获得内部的生产者工厂。
     *
     * @return 生产者工厂。
     * @author manbaum
     * @since 2019-01-15
     */
    public QProducerFactory<K, V> getFactory() {
        return factory;
    }

    /**
     * 设置内部的生产者工厂。
     *
     * @param factory 生产者工厂。
     * @author manbaum
     * @since 2019-01-15
     */
    public void setFactory(QProducerFactory<K, V> factory) {
        this.factory = factory;
    }

    /**
     * 获得主题名称。
     *
     * @return 主题名称。
     * @author manbaum
     * @since 2019-01-15
     */
    public String getTopic() {
        return topic;
    }

    /**
     * 设置主题名称。
     *
     * @param topic 主题名称。
     * @author manbaum
     * @since 2019-01-15
     */
    public void setTopic(String topic) {
        this.topic = topic;
    }

    /**
     * 获得分区号。
     *
     * @return 分区号。
     * @author manbaum
     * @since 2019-01-15
     */
    public Integer getPartition() {
        return partition;
    }

    /**
     * 设置分区号。
     *
     * @param partition 分区号。
     * @author manbaum
     * @since 2019-01-15
     */
    public void setPartition(Integer partition) {
        this.partition = partition;
    }
}
