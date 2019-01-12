package com.bocsoft.bfw.queue.boot;

import java.util.function.BiConsumer;
import java.util.function.Consumer;

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
