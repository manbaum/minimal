package com.bocsoft.bfw.queue;

import java.util.Enumeration;
import java.util.Properties;
import java.util.function.BiConsumer;

/**
 * 抽象基类，以方便使用 QConfig。
 *
 * <p></p>
 *
 * <p>如果代码需要使用 QConfig 来获得配置，可继承此基类。此类暴露了以下方法供子类使用：</p>
 * <ul>
 * <li>{@link #properties()} - 获得 Properties 对象。</li>
 * <li>{@link #isEmpty()} - 判断 properties 是否为空。</li>
 * <li>{@link #size()} - 获得 properties 中配置项数量。</li>
 * <li>{@link #getProperty(String)} 及 {@link #getProperty(String, String)}
 * - 获得某个配置项的值。</li>
 * <li>{@link #containsPropertyKey(Object)} - 判断是否存在给定配置项。</li>
 * <li>{@link #propertyKeys()} - 获得所有配置项名称。</li>
 * <li>{@link #forEachProperty(BiConsumer)} - 枚举所有配置项。</li>
 * </ul>
 *
 * <p></p>
 *
 * @author manbaum
 * @see QConfig
 * @since 2019-01-10
 */
public abstract class HasQConfig {

    private QConfig config;

    /**
     * 缺省构造。
     *
     * @author manbaum
     * @since 2019-01-10
     */
    protected HasQConfig() {
    }

    /**
     * 获得配置对象。
     *
     * @return 配置对象。
     * @author manbaum
     * @since 2019-01-10
     */
    public QConfig getConfig() {
        return config;
    }

    /**
     * 设置配置对象。
     *
     * @param config 配置对象。
     * @author manbaum
     * @since 2019-01-10
     */
    public void setConfig(QConfig config) {
        this.config = config;
    }

    /**
     * 获得当前配置。
     *
     * @return 当前配置。
     * @author manbaum
     * @since 2019-01-10
     */
    protected Properties properties() {
        return config.mergedProps();
    }

    /**
     * 判断配置是否为空。
     *
     * @return 如果配置为空则返回 <code>true</code>，否则返回 <code>false</code>。
     * @author manbaum
     * @since 2019-01-10
     */
    protected boolean isEmpty() {
        return config.mergedProps().isEmpty();
    }

    /**
     * 获得配置项数量。
     *
     * @return 配置项数量。
     * @author manbaum
     * @since 2019-01-10
     */
    protected int size() {
        return config.mergedProps().size();
    }

    /**
     * 获得某个特定配置项。
     *
     * @param key 配置项名称。
     * @return 配置项值。
     * @author manbaum
     * @since 2019-01-10
     */
    protected String getProperty(String key) {
        return config.mergedProps().getProperty(key);
    }

    /**
     * 获得某个特定配置项。若该项无配置则使用给定的默认值。
     *
     * @param key          配置项名称。
     * @param defaultValue 配置项缺省值。
     * @return 配置项值。
     * @author manbaum
     * @since 2019-01-10
     */
    protected String getProperty(String key, String defaultValue) {
        return config.mergedProps().getProperty(key, defaultValue);
    }

    /**
     * 判断是否存在特定配置项。
     *
     * @param key 配置项名称。
     * @return 如果存在则返回 <code>true</code>，否则返回 <code>false</code>。
     * @author manbaum
     * @since 2019-01-10
     */
    protected boolean containsPropertyKey(Object key) {
        return config.mergedProps().containsKey(key);
    }

    /**
     * 获得所有配置项名称。
     *
     * @return 配置项名称枚举器。
     * @author manbaum
     * @since 2019-01-10
     */
    protected Enumeration<Object> propertyKeys() {
        return config.mergedProps().keys();
    }

    /**
     * 遍历所有配置项，调用给定函数。
     *
     * @param action 配置项处理函数。
     * @author manbaum
     * @since 2019-01-10
     */
    protected void forEachProperty(BiConsumer<? super Object, ? super Object> action) {
        config.mergedProps().forEach(action);
    }
}
