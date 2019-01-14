package com.bocsoft.bfw.queue.kafka;

import com.bocsoft.bfw.queue.QPartitioner;
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

import java.util.Map;

/**
 * Class AbstractKafkaPartitioner.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public abstract class AbstractKafkaPartitioner<K, V> implements Partitioner, QPartitioner<K, V> {

    protected AbstractKafkaPartitioner() {
    }

    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        return partition(topic, cluster.partitionCountForTopic(topic), (K) key, (V) value);
    }

    @Override
    public void close() {
    }

    @Override
    public void configure(Map<String, ?> configs) {
    }
}
