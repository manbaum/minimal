package com.bocsoft.bfw.queue;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ClassPathResource;

import java.util.Properties;

/**
 * 封装 Properties 配置。
 *
 * <p></p>
 *
 * <p>使用者应使用 {@link #mergedProps()} 方法获得配置值。</p>
 * <ul>
 * <li>在 Bean 定义中，设置 props 属性，给出配置项缺省值。</li>
 * <li>设置 propsFile，用该文件中的配置值覆盖上述缺省值。</li>
 * </ul>
 *
 * <p>使用了 <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/io/ClassPathResource.html">ClassPathResource</a> 来读取 properties 文件，因此该文件应放在 ClassPath 路径下。</p>
 *
 * <p></p>
 *
 * <p>假设 <code>appliction.xml</code> 配置如下：</p>
 * <pre>
 *     &lt;bean id="myconfig" class="com.bocsoft.bfw.queue.QConfig"&gt;
 *         &lt;props name="props"&gt;
 *             &lt;property name="myAppSetting" value="unknown"/&gt;
 *         &lt;/props&gt;
 *         &lt;property name="propsFile" value="myapp.properties"/&gt;
 *     &lt;/bean&gt;
 * </pre>
 * <p>而 <code>myapp.properties</code> 文件内容如下：</p>
 * <pre>
 *     myAppSetting=yes
 * </pre>
 *
 * <p>则最终 <code>myconfig.mergedProps().getProperty("myAppSetting")</code>
 * 的值为 <code>"yes"</code>。</p>
 *
 * <p></p>
 *
 * @author manbaum
 * @see HasQConfig
 * @since 2019-01-10
 */
public class QConfig implements InitializingBean {

    private final Properties mergedProps = new Properties();
    private String propsFile;
    private Properties props;

    /**
     * 在 Setters 执行后初始化 Bean，创建合并的 properties。
     *
     * @throws Exception 当发生异常时。
     * @author manbaum
     * @since 2019-01-10
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        if (props != null) {
            mergedProps.putAll(props);
        }
        if (propsFile != null) {
            final ClassPathResource res = new ClassPathResource(propsFile);
            final Properties props = new Properties();
            props.load(res.getInputStream());
            mergedProps.putAll(props);
        }
    }

    /**
     * 获得合并后的配置值。
     *
     * @return 合并后的 properties。
     * @author manbaum
     * @since 2019-01-10
     */
    public Properties mergedProps() {
        return mergedProps;
    }

    /**
     * 获得设置的 properties 文件路径。
     *
     * @return properties 文件路径。
     * @author manbaum
     * @since 2019-01-10
     */
    public String getPropsFile() {
        return propsFile;
    }

    /**
     * 设置 properties 文件路径。
     *
     * @param propsFile properties 文件路径。
     * @author manbaum
     * @since 2019-01-10
     */
    public void setPropsFile(String propsFile) {
        this.propsFile = propsFile;
    }

    /**
     * 获得配置项的缺省值。
     *
     * @return 缺省 properties。
     * @author manbaum
     * @since 2019-01-10
     */
    public Properties getProps() {
        return props;
    }

    /**
     * 设置配置项的缺省值。
     *
     * @param props 缺省 properties 配置。
     * @author manbaum
     * @since 2019-01-10
     */
    public void setProps(Properties props) {
        this.props = props;
    }
}
