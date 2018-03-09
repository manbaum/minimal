package play;

import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.lang.reflect.Method;
import java.util.function.Predicate;

public final class CurriedMethodWrapper {

    private final static MethodHandles.Lookup Lookup = MethodHandles.lookup();

    private static MethodHandle bind(Object receiver, String methodName, MethodType methodType) {
        try {
            return Lookup.bind(receiver, methodName, methodType);
        } catch (IllegalAccessException | NoSuchMethodException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static MethodHandle findVirtual(Class<?> clazz, String methodName, MethodType methodType) {
        try {
            return Lookup.findVirtual(clazz, methodName, methodType);
        } catch (IllegalAccessException | NoSuchMethodException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static MethodHandle findStatic(Class<?> clazz, String methodName, MethodType methodType) {
        try {
            return Lookup.findStatic(clazz, methodName, methodType);
        } catch (IllegalAccessException | NoSuchMethodException ex) {
            throw new RuntimeException(ex);
        }
    }

    private final static MethodType InvokeMethodType = MethodType.methodType(Object.class, Object[].class);
    private final static MethodHandle InvokeMethodHandle = findVirtual(CurriedMethodWrapper.class, "invoke", InvokeMethodType);

    public final MethodHandle invokeMethodHandle;
    private final MethodHandle sourceMethodHandle;
    private final Object[] savedArgs;

    public CurriedMethodWrapper(MethodHandle method, Object[] args) {
        this.invokeMethodHandle = InvokeMethodHandle.bindTo(this).asVarargsCollector(Object[].class);
        this.sourceMethodHandle = method;
        this.savedArgs = args;
    }

    public Object invoke(Object... args) {
        if (args.length > 0) {
            int n = savedArgs != null ? savedArgs.length : 0;
            Object[] newArgs = new Object[n + args.length];
            if (n > 0) {
                System.arraycopy(savedArgs, 0, newArgs, 0, n);
            }
            System.arraycopy(args, 0, newArgs, n, args.length);
            n += args.length;
            int needArgs = sourceMethodHandle.type().parameterCount();
            if (needArgs > n) {
                return new CurriedMethodWrapper(sourceMethodHandle, newArgs).invokeMethodHandle;
            } else {
                try {
                    return sourceMethodHandle.invokeWithArguments(newArgs);
                } catch (Throwable ex) {
                    throw new RuntimeException(ex);
                }
            }
        } else {
            return this.invokeMethodHandle;
        }
    }

    public static MethodHandle connectTo(MethodHandle source) {
        return new CurriedMethodWrapper(source, null).invokeMethodHandle;
    }

    public static MethodHandle connectVirtual(Object target, String methodName, MethodType methodType) {
        return connectTo(bind(target, methodName, methodType));
    }

    public static MethodHandle connectStatic(Class<?> clazz, String methodName, MethodType methodType) {
        return connectTo(findStatic(clazz, methodName, methodType));
    }

    private static Method findMethod(Class<?> clazz, Predicate<Method> p) {
        if (clazz == null) return null;
        System.out.println("... searching in " + clazz);
        for (Method m : clazz.getDeclaredMethods()) {
            if (p.test(m)) return m;
        }
        Class<?>[] ints = clazz.getInterfaces();
        for (int i = 0; i < ints.length; i++) {
            Method m = findMethod(ints[i], p);
            if (m != null) return m;
        }
        return findMethod(clazz.getSuperclass(), p);
    }

    public static MethodHandle connectVirtual(Object target, String methodName) {
        Predicate<Method> p = m -> m.getName().equals(methodName);
        Method m = findMethod(target.getClass(), p);
        m.setAccessible(true);
        try {
            MethodHandle handle = Lookup.unreflect(m);
            return connectTo(handle);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static MethodHandle connectStatic(Class<?> clazz, String methodName) {
        Predicate<Method> p = m -> m.getName().equals(methodName);
        Method m = findMethod(clazz, p);
        MethodType methodType = MethodType.methodType(m.getReturnType(), m.getParameterTypes());
        return connectTo(findStatic(clazz, methodName, methodType));
    }
}
