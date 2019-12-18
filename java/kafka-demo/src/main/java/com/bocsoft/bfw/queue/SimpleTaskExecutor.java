package com.bocsoft.bfw.queue;

import org.springframework.beans.factory.InitializingBean;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Class SimpleRunableExecutor.
 * <p>
 *
 * @author manbaum
 * @since Jan 15, 2019
 */
public class SimpleRunableExecutor implements InitializingBean {

    private ExecutorService executor;
    private List<StopableTask> tasks;
    private boolean autoStart = false;

    @Override
    public void afterPropertiesSet() throws Exception {
        if (autoStart) start();
    }

    public void start() {
        if (executor == null) throw new NullPointerException("null.executor");
        if (tasks == null) throw new NullPointerException("null.tasks");
        tasks.forEach(executor::submit);
    }

    public boolean awaitShutdown(long millis) throws InterruptedException {
        tasks.forEach(StopableTask::stop);
        executor.shutdown();
        return executor.awaitTermination(millis, TimeUnit.MILLISECONDS);
    }

    public ExecutorService getExecutor() {
        return executor;
    }

    public void setExecutor(ExecutorService executor) {
        this.executor = executor;
    }

    public List<StopableTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<StopableTask> tasks) {
        this.tasks = tasks;
    }

    public boolean isAutoStart() {
        return autoStart;
    }

    public void setAutoStart(boolean autoStart) {
        this.autoStart = autoStart;
    }
}
