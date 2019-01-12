package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QProducer;

/**
 * Class BootSender.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class BootSender implements Runnable {

    private final QProducer<String, String> producer;
    private volatile boolean shouldStop = false;
    private int count = 0;

    public BootSender(QProducer<String, String> producer) {
        this.producer = producer;
    }

    public void stop() {
        shouldStop = true;
    }

    @Override
    public void run() {
        while (!shouldStop) {
            String message = "message(" + count + ")";
            producer.send(null, message);
            System.out.println("+++ Record produced: " + message + ".");
            ++count;
            BootTest.sleep(BootTest.random(0L, 20L));
        }
    }

    public void printStatistics() {
        System.out.println("*** Total " + count + " record(s) produced for " + producer.topic() + ".");
    }
}