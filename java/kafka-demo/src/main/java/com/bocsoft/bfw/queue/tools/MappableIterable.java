package com.bocsoft.bfw.queue.tools;

import java.util.function.BiFunction;
import java.util.function.Function;

/**
 * Interface MappableIterable.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface MappableIterable<T> extends Iterable<T> {

    static <X> MappableIterable<X> of(Iterable<X> iterable) {
        return iterable instanceof MappableIterable
                ? (MappableIterable<X>) iterable
                : new MappedIterable<>(iterable, Function.identity());
    }

    static <X, R> MappableIterable<R> map(Iterable<X> iterable, Function<X, R> function) {
        return new MappedIterable<>(iterable, function);
    }

    <R> MappableIterable<R> map(Function<T, R> function);


    default <R> R foldLeft(BiFunction<R, T, R> function, R initValue) {
        return CollectionMapper.foldLeft(iterator(), function, initValue);
    }

    default <R> R foldRight(BiFunction<T, R, R> function, R initValue) {
        return CollectionMapper.foldRight(iterator(), function, initValue);
    }
}
