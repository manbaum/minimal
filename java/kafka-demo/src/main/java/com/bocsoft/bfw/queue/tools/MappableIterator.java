package com.bocsoft.bfw.queue.tools;

import java.util.Iterator;
import java.util.function.Function;

/**
 * Interface MappableIterator.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface MappableIterator<T> extends Iterator<T> {

    static <X> MappableIterator<X> of(Iterator<X> iterator) {
        return iterator instanceof MappableIterator
                ? (MappableIterator<X>) iterator
                : new MappedIterator<>(iterator, Function.identity());
    }

    static <X, R> MappableIterator<R> map(Iterator<X> iterator, Function<X, R> function) {
        return new MappedIterator<>(iterator, function);
    }

    <R> MappableIterator<R> map(Function<T, R> function);
}
