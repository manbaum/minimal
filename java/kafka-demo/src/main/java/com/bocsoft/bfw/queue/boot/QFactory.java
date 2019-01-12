package com.bocsoft.bfw.queue.boot;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerFactory;
import com.bocsoft.bfw.queue.QProducerFactory;
import com.bocsoft.bfw.queue.QProducer;

/**
 * Class QFactory.
 * <p>
 *
 * @author manbaum
 * @since Jan 10, 2019
 */
public class QFactory<K, V> {

    private QConfig producerConfig;
    private QConfig consumerConfig;

    private QProducerFactory<K, V> producerFactory;
    private QConsumerFactory<K, V> consumerFactory;

    private String topic;
    private Integer partition;

    public QConfig getProducerConfig() {
        return producerConfig;
    }

    public void setProducerConfig(QConfig producerConfig) {
        this.producerConfig = producerConfig;
    }

    public QConfig getConsumerConfig() {
        return consumerConfig;
    }

    public void setConsumerConfig(QConfig consumerConfig) {
        this.consumerConfig = consumerConfig;
    }

    public QProducerFactory<K, V> getProducerFactory() {
        return producerFactory;
    }

    public void setProducerFactory(QProducerFactory<K, V> producerFactory) {
        this.producerFactory = producerFactory;
    }

    public QConsumerFactory<K, V> getConsumerFactory() {
        return consumerFactory;
    }

    public void setConsumerFactory(QConsumerFactory<K, V> consumerFactory) {
        this.consumerFactory = consumerFactory;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getPartition() {
        return partition;
    }

    public void setPartition(Integer partition) {
        this.partition = partition;
    }

    public QProducer<K, V> createProducer() {
        return producerFactory.create(producerConfig.mergedProps());
    }

    public QConsumer<K, V> createConsumer() {
        return consumerFactory.create(consumerConfig.mergedProps(), topic, partition);
    }

    public QConsumer<K, V> createConsumer(String topic, Integer partition) {
        return consumerFactory.create(consumerConfig.mergedProps(), topic, partition);
    }
}
