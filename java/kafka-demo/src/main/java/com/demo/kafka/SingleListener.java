package com.demo.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Class SingleListener.
 * <p>
 *
 * @author manbaum
 * @since Jan 07, 2019
 */
@Component
public class SingleListener {

    private static final Logger log = LoggerFactory.getLogger(SingleListener.class);

    @KafkaListener(id = "consumer", topics = "topic.quick.consumer")
    public void consumerListener(ConsumerRecord<Integer, String> record) {
        log.info("topic.quick.consumer receive : " + record.toString());
    }
}
