package com.bocsoft.bfw.queue;

import java.util.Enumeration;
import java.util.Properties;
import java.util.function.BiConsumer;

public abstract class HasQConfig {

    private QConfig config;

    protected HasQConfig() {
    }

    public QConfig getConfig() {
        return config;
    }

    public void setConfig(QConfig config) {
        this.config = config;
    }

    public String getProperty(String key) {
        return config.mergedProps().getProperty(key);
    }

    public Properties properties() {
        return config.mergedProps();
    }

    protected String getProperty(String key, String defaultValue) {
        return config.mergedProps().getProperty(key, defaultValue);
    }

    protected int size() {
        return config.mergedProps().size();
    }

    protected boolean isEmpty() {
        return config.mergedProps().isEmpty();
    }

    protected Enumeration<Object> propertyKeys() {
        return config.mergedProps().keys();
    }

    protected boolean containsPropertyKey(Object key) {
        return config.mergedProps().containsKey(key);
    }

    protected void forEachProperty(BiConsumer<? super Object, ? super Object> action) {
        config.mergedProps().forEach(action);
    }
}
