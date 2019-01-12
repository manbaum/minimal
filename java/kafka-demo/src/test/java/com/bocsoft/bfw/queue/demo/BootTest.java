package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerFactory;
import com.bocsoft.bfw.queue.QPoller;
import com.bocsoft.bfw.queue.QProducer;
import com.bocsoft.bfw.queue.QProducerFactory;
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

    private QProducerFactory<String, String> producerFactory;
    private QConsumerFactory<String, String> consumerFactory;
    private String topic;
    private ExecutorService executor;

    public QProducerFactory<String, String> getProducerFactory() {
        return producerFactory;
    }

    public void setProducerFactory(QProducerFactory<String, String> producerFactory) {
        this.producerFactory = producerFactory;
    }

    public QConsumerFactory<String, String> getConsumerFactory() {
        return consumerFactory;
    }

    public void setConsumerFactory(QConsumerFactory<String, String> consumerFactory) {
        this.consumerFactory = consumerFactory;
    }

    public ExecutorService getExecutor() {
        return executor;
    }

    public void setExecutor(ExecutorService executor) {
        this.executor = executor;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("/application.xml");
        BootTest app = context.getBean("q.test", BootTest.class);
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

    public void printStatistics(QPoller<?, ?, ?>... pollers) {
        for (QPoller<?, ?, ?> poller : pollers) {
            final BootRecordHandler handler = (BootRecordHandler) poller.getHandler();
            handler.printStatistics();
        }
    }

    private QPoller<String, String, Object> createPoller(QConsumer<String, String> consumer) {
        final QPoller<String, String, Object> poller = new QPoller<>(consumer, null);
        poller.setHandler(new BootRecordHandler(consumer.topic(), consumer.partition()));
        poller.setErrorHandler(new BootErrorHandler());
        return poller;
    }

    public void doTest() {
        final QConsumer<String, String> consumer0 = consumerFactory.create(topic, 0);
        final QConsumer<String, String> consumer1 = consumerFactory.create(topic, 1);
        final QProducer<String, String> producer = producerFactory.create(topic);

        try {
            final QPoller<?, ?, ?> poller0 = createPoller(consumer0);
            final QPoller<?, ?, ?> poller1 = createPoller(consumer1);
            final BootSender sender = new BootSender(producer);

            sleep(2000L);
            System.out.println("*** ALL SET, RUN!!!");
            submitAll(executor, poller0, poller1, sender);

            sleep(5000);
            sender.stop();
            sleep(7000);
            poller0.stop();
            poller1.stop();

            joinAll(executor);
            sender.printStatistics();
            printStatistics(poller0, poller1);

        } finally {
            producer.close();
            consumer0.close();
            consumer1.close();
        }
    }
}
