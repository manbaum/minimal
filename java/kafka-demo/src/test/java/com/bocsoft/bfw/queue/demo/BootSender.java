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

    public BootSender(QProducer<String, String> producer) {
        this.producer = producer;
    }

    public void stop() {
        shouldStop = true;
    }

    @Override
    public void run() {
        int i = 0;
        while (!shouldStop) {
            String message = "message(" + i + ")";
            producer.send(null, message);
            System.out.println("+++ Record produced: " + message + ".");
            ++i;
            BootTest.sleep(BootTest.random(0L, 20L));
        }
        System.out.println("*** Total " + i + " record(s) produced for " + producer.topic() + ".");
    }
}
