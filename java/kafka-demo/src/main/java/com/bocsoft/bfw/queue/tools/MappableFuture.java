package com.bocsoft.bfw.queue.tools;

import java.util.concurrent.Future;
import java.util.function.Function;

/**
 * Interface MappableFuture.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public interface MappableFuture<T> extends Future<T> {

    static <X> MappableFuture<X> of(Future<X> future) {
        return future instanceof MappedFuture
                ? (MappableFuture<X>) future
                : new MappedFuture<>(future, Function.identity());
    }

    static <X, R> MappableFuture<R> map(Future<X> future, Function<X, R> function) {
        return new MappedFuture<>(future, function);
    }

    <R> Future<R> map(Function<T, R> function);
}
