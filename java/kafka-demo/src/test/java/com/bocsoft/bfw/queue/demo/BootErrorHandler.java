package com.bocsoft.bfw.queue.demo;

import com.bocsoft.bfw.queue.QConsumer;
import com.bocsoft.bfw.queue.QConsumerRecord;
import com.bocsoft.bfw.queue.QErrorHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BootErrorHandler implements QErrorHandler<Integer, String, Object> {

    private static final Logger logger = LoggerFactory.getLogger(BootErrorHandler.class);

    @Override
    public void process(Exception exception, QConsumerRecord<Integer, String> record, Object context, QConsumer<Integer, String> consumer) {
        logger.error("record.handle.error", exception);
        logger.error("record.detail: " + record.toString());
    }
}
