package com.bocsoft.bfw.queue;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.ClassPathResource;

import java.util.Properties;

/**
 * Class QConfig.
 * <p>
 *
 * @author manbaum
 * @since Jan 10, 2019
 */
public class QConfig implements InitializingBean {

    private final Properties mergedProps = new Properties();
    private String propsFile;
    private Properties props;

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

    public Properties mergedProps() {
        return mergedProps;
    }

    public String getPropsFile() {
        return propsFile;
    }

    public void setPropsFile(String propsFile) {
        this.propsFile = propsFile;
    }

    public Properties getProps() {
        return props;
    }

    public void setProps(Properties props) {
        this.props = props;
    }
}
