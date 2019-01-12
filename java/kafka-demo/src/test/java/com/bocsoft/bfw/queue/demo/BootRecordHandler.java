package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QConsumerRecords;
import com.bocsoft.bfw.queue.QPoller;
import com.bocsoft.bfw.queue.QRecordHandler;

import java.time.Duration;
import java.util.Calendar;

/**
 * Class BootRecordHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class BootRecordHandler implements QRecordHandler<String, String> {

    private int count = 0;
    private int uncount = 0;
    private long max = Long.MIN_VALUE;
    private long min = Long.MAX_VALUE;
    private long sum = 0L;
    private double avg = 0D;

    @Override
    public void process(QConsumerRecord<String, String> record) {
        final String latency = updateStatistics(record);
        final String topicPartition = record.topic() + ":" + record.partition();
        System.out.println(record + " " + topicPartition + " " + latency);
    }

    private String updateStatistics(QConsumerRecord<?, ?> r) {
        ++count;
        if (r.timestamp() == null) {
            ++uncount;
            return "";
        } else {
            final long now = Calendar.getInstance().getTimeInMillis();
            final long delta = now - r.timestamp();
            max = Math.max(max, delta);
            min = Math.min(min, delta);
            sum += delta;
            final int rcount = count - uncount;
            avg = rcount > 0 ? (double) sum / rcount : 0D;
            return delta + "ms";
        }
    }

    public void printStatistics(QConsumer<String, String> consumer) {
        final String topicPartition = consumer.topic() + ":" + consumer.partition();
        System.out.println("*** Total " + count + " record(s) consumed from " + topicPartition + ".");
        System.out.println("*** Latency statistics: min = " + min + ", max = " + max + ", avg = " + avg);
    }
}
