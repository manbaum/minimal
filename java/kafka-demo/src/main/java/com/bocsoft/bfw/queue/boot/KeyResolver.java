package com.bocsoft.bfw.queue.boot;

/**
 * Interface KeyResolver.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public interface KeyResolver<K, V> {

    K resolve(V value);
}
