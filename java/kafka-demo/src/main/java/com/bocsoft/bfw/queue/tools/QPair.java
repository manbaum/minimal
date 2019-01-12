package com.bocsoft.bfw.queue.tools;

import java.util.function.Function;

/**
 * Class QPair.
 * <p>
 *
 * @author manbaum
 * @since Jan 11, 2019
 */
public final class QPair<K, V> {

    private final K key;
    private final V value;

    public QPair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K key() {
        return key;
    }

    public V value() {
        return value;
    }

    public <X> QPair<X, V> key(X key) {
        return new QPair<>(key, value);
    }

    public <Y> QPair<K, Y> value(Y value) {
        return new QPair<>(key, value);
    }

    public <X> QPair<X, V> mapKey(Function<K, X> f) {
        return new QPair<>(f.apply(key), value);
    }

    public <Y> QPair<K, Y> mapValue(Function<V, Y> g) {
        return new QPair<>(key, g.apply(value));
    }
}
