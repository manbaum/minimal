package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QConsumerRecords;

import java.time.Duration;
import java.util.Calendar;

/**
 * Class Poller.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class Poller implements Runnable {

    private final QConsumer<String, String> consumer;
    private volatile boolean shouldStop = false;

    private int count = 0;
    private int uncount = 0;
    private long max = Long.MIN_VALUE;
    private long min = Long.MAX_VALUE;
    private long sum = 0L;
    private double avg = 0D;

    public Poller(QConsumer<String, String> consumer) {
        this.consumer = consumer;
    }

    public void stop() {
        shouldStop = true;
    }

    private String updateStatistics(long now, QConsumerRecord<?, ?> r) {
        if (r.timestamp() == null) {
            ++uncount;
            return "";
        } else {
            final long delta = now - r.timestamp();
            max = Math.max(max, delta);
            min = Math.min(min, delta);
            sum += delta;
            final int rcount = count - uncount;
            avg = rcount > 0 ? (double) sum / rcount : 0D;
            return delta + "ms";
        }
    }

    @Override
    public void run() {
        final String topicPartition = consumer.topic() + ":" + consumer.partition();
        while (!shouldStop) {
            final QConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100L));
            final long now = Calendar.getInstance().getTimeInMillis();
            if (records != null && records.count() > 0) {
                System.out.println("--- " + records.count() + " record(s) received from " +
                        topicPartition + " ...");
                records.iterator().forEachRemaining(r -> {
                    final String latency = updateStatistics(now, r);
                    System.out.println(r + " " + topicPartition + " " + latency);
                });
                count += records.count();
                consumer.commitSync();
            } else {
                BootTest.sleep(200L);
            }
        }
        System.out.println("*** Total " + count + " record(s) consumed from " + topicPartition + ".");
        System.out.println("*** Latency statistics: min = " + min + ", max = " + max + ", avg = " + avg);
    }
}
