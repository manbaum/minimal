package com.bocsoft.bfw.queue.tools;

import java.util.Iterator;
import java.util.function.Function;

/**
 * Class MappedIterable.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class MappedIterable<T, R> implements MappableIterable<R> {

    private final Iterable<T> iterable;
    private final Function<T, R> function;

    public MappedIterable(Iterable<T> iterable, Function<T, R> function) {
        this.iterable = iterable;
        this.function = function;
    }

    @Override
    public <X> MappableIterable<X> map(Function<R, X> function) {
        return new MappedIterable<>(this, function);
    }

    @Override
    public Iterator<R> iterator() {
        return MappableIterator.of(iterable.iterator()).map(function);
    }
}
