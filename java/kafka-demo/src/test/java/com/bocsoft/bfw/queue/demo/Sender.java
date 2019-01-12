package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QProducer;
import com.bocsoft.bfw.queue.QProducerRecord;
import com.bocsoft.bfw.queue.SimpleProducerRecoder;

/**
 * Class Sender.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class Sender implements Runnable {

    private final QProducer<String, String> producer;
    private final String topic;
    private volatile boolean shouldStop = false;

    public Sender(QProducer<String, String> producer, String topic) {
        this.producer = producer;
        this.topic = topic;
    }

    public void stop() {
        shouldStop = true;
    }

    @Override
    public void run() {
        int i = 0;
        while (!shouldStop) {
            producer.send(record(i));
            System.out.println("+++ Record produced: message(" + i + ").");
            ++i;
            BootTest.sleep(BootTest.random(0L, 20L));
        }
        System.out.println("*** Total " + i + " record(s) produced for " + topic + ".");
    }

    public QProducerRecord<String, String> record(int i) {
        return new SimpleProducerRecoder<>(topic, "message(" + i + ")");
    }
}
