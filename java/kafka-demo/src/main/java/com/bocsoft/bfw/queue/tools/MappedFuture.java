package com.bocsoft.bfw.queue.tools;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Function;

/**
 * Class MappedFuture.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class MappedFuture<T, R> implements MappableFuture<R> {

    private final Future<T> future;
    private final Function<T, R> function;

    MappedFuture(Future<T> future, Function<T, R> function) {
        this.future = future;
        this.function = function;
    }

    @Override
    public <X> Future<X> map(Function<R, X> function) {
        return new MappedFuture<R, X>(this, function);
    }

    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
        return future.cancel(mayInterruptIfRunning);
    }

    @Override
    public boolean isCancelled() {
        return future.isCancelled();
    }

    @Override
    public boolean isDone() {
        return future.isDone();
    }

    @Override
    public R get() throws InterruptedException, ExecutionException {
        return function.apply(future.get());
    }

    @Override
    public R get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException {
        return function.apply(future.get(timeout, unit));
    }
}
