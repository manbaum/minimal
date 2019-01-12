package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QRecordHandler;

import java.util.Calendar;

/**
 * Class BootRecordHandler.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class BootRecordHandler implements QRecordHandler<String, String, Object> {

    private final String topicPartition;

    private int count = 0;
    private int uncount = 0;
    private long max = Long.MIN_VALUE;
    private long min = Long.MAX_VALUE;
    private long sum = 0L;
    private double avg = 0D;

    public BootRecordHandler(String topic, Integer partition) {
        this.topicPartition = topic + ":" + partition;
    }

    @Override
    public void process(QConsumerRecord<String, String> record, Object context) {
        final String latency = updateStatistics(record);
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

    public void printStatistics() {
        System.out.println("*** Total " + count + " record(s) consumed from " + topicPartition + ".");
        System.out.println("*** Latency statistics: min = " + min + ", max = " + max + ", avg = " + avg);
    }
}
