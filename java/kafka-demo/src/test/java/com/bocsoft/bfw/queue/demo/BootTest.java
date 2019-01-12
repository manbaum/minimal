package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QProducer;
import com.bocsoft.bfw.queue.boot.QFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Class BootTest.
 * <p>
 *
 * @author manbaum
 * @since Jan 10, 2019
 */
public class BootTest {

    private QFactory<String, String> factory;
    private ExecutorService executor;

    private String topic = "q-test-topic";

    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("/application.xml");
        BootTest app = new BootTest();
        app.factory = context.getBean("q.factory", QFactory.class);
        app.executor = context.getBean("q.consumer.executor", ExecutorService.class);
        app.doTest();
    }

    public static long random(long min, long max) {
        return min + (long) (Math.random() * (max - min));
    }

    public static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            System.out.println(ex);
        }
    }

    public static void submitAll(ExecutorService executor, Runnable... tasks) {
        for (Runnable task : tasks) {
            executor.submit(task);
        }
    }

    public static void joinAll(ExecutorService executor) {
        try {
            executor.shutdown();
            executor.awaitTermination(3000L, TimeUnit.MILLISECONDS);
        } catch (InterruptedException ex) {
            System.out.println(ex);
        }
    }

    public void doTest() {
        final QConsumer<String, String> consumer0 = factory.createConsumer(topic, 0);
        final QConsumer<String, String> consumer1 = factory.createConsumer(topic, 1);
        final QProducer<String, String> producer = factory.createProducer();

        try {
            final Poller poller0 = new Poller(consumer0);
            final Poller poller1 = new Poller(consumer1);
            final Sender sender = new Sender(producer, topic);

            sleep(2000L);
            System.out.println("*** ALL SET, RUN!!!");
            submitAll(executor, poller0, poller1, sender);

            sleep(5000);
            sender.stop();
            sleep(7000);
            poller0.stop();
            poller1.stop();

            joinAll(executor);

        } finally {
            producer.close();
            consumer0.close();
            consumer1.close();
        }
    }
}
