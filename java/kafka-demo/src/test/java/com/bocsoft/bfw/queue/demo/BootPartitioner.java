package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.kafka.AbstractKafkaPartitioner;

/**
 * Class BootPartitioner.
 * <p>
 *
 * @author manbaum
 * @since Jan 14, 2019
 */
public class BootPartitioner extends AbstractKafkaPartitioner<Integer, String> {

    @Override
    public int partition(String topic, int numberPartitions, Integer key, String value) {
        return numberPartitions > 0 ? key % numberPartitions : 0;
    }
}
