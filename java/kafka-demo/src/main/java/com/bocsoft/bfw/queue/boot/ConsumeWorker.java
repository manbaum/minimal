package com.bocsoft.bfw.queue.boot;

import java.util.function.BiConsumer;

/**
 * Class ConsumeWorker.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public class ConsumeWorker<K, V> {

    private BiConsumer<K, V> consumer;
}
