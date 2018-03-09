package play;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.util.TraceClassVisitor;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.net.URL;
import java.util.Collection;

import com.dnw.whid.vm.Stack;


public class Test {

    public int add(int x, int y) {
        return x + y;
    }

    public static int add3s(int x, int y, int z) {
        return x + y + z;
    }

    public int add3(int x, int y, int z) {
        return x + y + z;
    }

    public static final class Test2 extends Test {
    }

    public static void main(String[] args) {
        try {
            Test t = new Test();
            MethodHandles.Lookup lookup = MethodHandles.lookup();

            MethodType mt = MethodType.fromMethodDescriptorString("(II)I", null);
            MethodHandle mh = lookup.findVirtual(Test.class, "add", mt);
            Object r = mh.invoke(t, 1, 2);
            System.out.println(r);

            MethodHandle mh2 = MethodHandles.insertArguments(mh, 0, t, 2);
            r = mh2.invoke(2);
            System.out.println(r);

            mt = MethodHandles.constant(int.class, 0).type();
            System.out.println(mt.toMethodDescriptorString());

            ClassLoader cl = Test.class.getClassLoader();
            String name = "play/Test.class";
            URL url = cl.getResource(name);
            System.out.println(url);
            InputStream is = cl.getResourceAsStream(name);
            ClassReader cr = new ClassReader(is);
            TraceClassVisitor cv = new TraceClassVisitor(new PrintWriter(System.out));
            cr.accept(cv, 0);
            is.close();

            name = "org/objectweb/asm/ClassWriter.class";
            url = cl.getResource(name);
            System.out.println(url);
            is = cl.getResourceAsStream(name);
            int bytes = is.available();
            byte[] buffer = new byte[bytes];
            int len = is.read(buffer);
            dump(buffer, len);
            is.close();

            mt = MethodType.methodType(int.class, int.class, int.class, int.class);
            mh2 = lookup.findStatic(Test.class, "add3s", mt);
            System.out.println(mh2.invoke(2, 3, 4));
            System.out.println(mh2.invokeWithArguments(2, 3, 4));

            MethodHandle f = CurriedMethodWrapper.connectVirtual(new Test2(), "add3");
            MethodHandle f2 = (MethodHandle) f.invoke(2);
            r = f2.invoke(4, 3);
            System.out.println(r);
            r = f2.invoke(5, 4);
            System.out.println(r);

            Stack<Object> stack = new Stack<>();
            for (int i = 0; i < 10; i++) {
                stack.add(i);
            }
            System.out.println(join(", ", stack));
            stack.drop(4);
            stack.pick(3);
            stack.pick(3);
            stack.dup();
            System.out.println(join(", ", stack));

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(os);
            oos.writeInt(0x10203040);
            oos.writeUTF("河马");
            oos.flush();
            oos.close();
            byte[] buf = os.toByteArray();
            dump(buf, buf.length);

            System.out.println(Integer.toHexString(Float.floatToIntBits(0)));
            System.out.println(Integer.toHexString(Float.floatToIntBits(1)));
            System.out.println(Integer.toHexString(Float.floatToIntBits(2)));

            System.out.println(Long.toHexString(Double.doubleToLongBits(0)));
            System.out.println(Long.toHexString(Double.doubleToLongBits(1)));

            byte b1 = (byte)0xa6, b2 = (byte)0x88;
            System.out.println(Integer.toHexString((int)b1));
            System.out.println(Integer.toHexString((int)(b1 & 0xff)));
            System.out.println(Integer.toHexString((int)((b1 << 8) | (b2 & 0xff))));
            System.out.println(Integer.toHexString((int)(((b1 & 0xff) << 8) | (b2 & 0xff))));

        } catch (Throwable ex) {
            ex.printStackTrace();
        }
    }

    public static String join(String sp, Collection<?> coll) {
        StringBuffer sb = new StringBuffer();
        boolean first = true;
        for (Object e : coll) {
            if (first) first = false;
            else sb.append(sp);
            sb.append(e);
        }
        return sb.toString();
    }

    public static String hex4(int n) {
        StringBuffer sb = new StringBuffer("0000");
        sb.append(Integer.toHexString(n));
        return sb.substring(sb.length() - 4);
    }

    public static String hex2(int n) {
        StringBuffer sb = new StringBuffer("00");
        sb.append(Integer.toHexString(n));
        return sb.substring(sb.length() - 2);
    }

    public static void dump(byte[] buffer, int len) {
        for (int i = 0; i < len; i += 16) {
            System.out.print(hex4(i));
            System.out.print(" - ");
            for (int j = 0; j < 16 && i + j < len; j++) {
                if (j == 8) System.out.print(" - ");
                System.out.print(hex2(buffer[i + j]));
                System.out.print(' ');
            }
            System.out.println();
        }
    }
}
