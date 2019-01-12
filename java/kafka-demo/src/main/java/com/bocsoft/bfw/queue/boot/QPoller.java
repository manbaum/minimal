package com.bocsoft.bfw.queue.boot;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 * Class QPoller.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class QPoller<K, V> implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(QPoller.class);

    private QConsumer<K, V> consumer;
    private long pollTimeout = 100L;
    private long pollIdle = 100L;

    private boolean logEveryRecord = false;
    private boolean logFailedRecord = false;
    private QHandler<K, V> handler;
    private QErrorHandler<K, V> errorHandler;

    private volatile boolean shouldStop = false;

    public QConsumer<K, V> getConsumer() {
        return consumer;
    }

    public void setConsumer(QConsumer<K, V> consumer) {
        this.consumer = consumer;
    }

    public long getPollTimeout() {
        return pollTimeout;
    }

    public void setPollTimeout(long timeout) {
        this.pollTimeout = timeout;
    }

    public long getPollIdle() {
        return pollIdle;
    }

    public void setPollIdle(long pollIdle) {
        this.pollIdle = pollIdle;
    }

    public boolean isLogEveryRecord() {
        return logEveryRecord;
    }

    public void setLogEveryRecord(boolean logEveryRecord) {
        this.logEveryRecord = logEveryRecord;
    }

    public boolean isLogFailedRecord() {
        return logFailedRecord;
    }

    public void setLogFailedRecord(boolean logFailedRecord) {
        this.logFailedRecord = logFailedRecord;
    }

    public QHandler<K, V> getHandler() {
        return handler;
    }

    public void setHandler(QHandler<K, V> handler) {
        this.handler = handler;
    }

    public QErrorHandler<K, V> getErrorHandler() {
        return errorHandler;
    }

    public void setErrorHandler(QErrorHandler<K, V> errorHandler) {
        this.errorHandler = errorHandler;
    }

    public void stop() {
        shouldStop = true;
    }

    private void handleRecord(QConsumerRecord<K, V> record) {
        try {
            if (logEveryRecord) {
                logger.info(record.toString());
            }
            handler.process(record);
        } catch (Exception ex) {
            handleError(record, ex);
        }
    }

    private void handleError(QConsumerRecord<K, V> record, Exception exception) {
        try {
            if (logFailedRecord) {
                logger.error(record.toString());
            }
            errorHandler.process(record, exception);
        } catch (Exception ex) {
            logger.warn("ignored.exception", ex);
        }
    }

    private void sleep() {
        try {
            Thread.sleep(pollIdle);
        } catch (InterruptedException ex) {
            logger.warn("ignored.exception", ex);
        }
    }

    @Override
    public void run() {
        final Duration duration = Duration.ofMillis(pollTimeout);
        while (!shouldStop) {
            final QConsumerRecords<K, V> records = consumer.poll(duration);
            if (records != null && records.count() > 0) {
                records.iterator().forEachRemaining(this::handleRecord);
            } else if (pollIdle > 0) {
                sleep();
            }
        }
    }
}
