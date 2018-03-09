package play;

import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;

import java.util.regex.Pattern;

public class HotSwapClassLoader extends ClassLoader {

    private Pattern classNamePattern;

    public HotSwapClassLoader(Pattern classNamePattern) {
        if (classNamePattern == null) throw new NullPointerException("null.class.name.pattern");
        this.classNamePattern = classNamePattern;
    }

    private Class<?> createClassThruAsm(String name) {
        return null;
    }

    protected Class loadClass(String name, boolean resolve) throws ClassNotFoundException {
        Class clazz = findLoadedClass(name);
        if (clazz == null && this.classNamePattern.matcher(name).matches()) {
            clazz = createClassThruAsm(name);
        }
        if (clazz == null) {
            throw new ClassNotFoundException(name);
        }
        if (resolve) {
            resolveClass(clazz);
        }
        return clazz;
    }
}
