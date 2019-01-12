package com.bocsoft.bfw.queue.tools;

import java.util.Iterator;
import java.util.function.Function;

/**
 * Class MappedIterator.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class MappedIterator<T, R> implements MappableIterator<R> {

    private final Iterator<T> iterator;
    private final Function<T, R> function;

    public MappedIterator(Iterator<T> iterator, Function<T, R> function) {
        this.iterator = iterator;
        this.function = function;
    }

    @Override
    public <X> MappableIterator<X> map(Function<R, X> function) {
        return new MappedIterator<R, X>(this, function);
    }

    @Override
    public boolean hasNext() {
        return iterator.hasNext();
    }

    @Override
    public R next() {
        return function.apply(iterator.next());
    }
}
