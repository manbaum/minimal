package com.bocsoft.bfw.queue.kafka;

import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

import java.util.Map;

/**
 * Class KafkaPartitionerAdapter.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class KafkaPartitionerAdapter implements Partitioner {

    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        return 0;
    }

    @Override
    public void close() {
    }

    @Override
    public void configure(Map<String, ?> configs) {
    }
}
