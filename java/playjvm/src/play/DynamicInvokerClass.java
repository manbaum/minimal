package play;

import org.objectweb.asm.*;

import java.lang.invoke.CallSite;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class DynamicInvokerClass implements Opcodes {

    private final String invokerClassName;
    private final String linkageClassName;
    private final String bootstrapMethodName;
    private final String targetMethodDesc;

    public DynamicInvokerClass(String invokerClassName, String linkageClassName, String bootstrapMethodName, String targetMethodDesc) {
        this.invokerClassName = invokerClassName;
        this.linkageClassName = linkageClassName;
        this.bootstrapMethodName = bootstrapMethodName;
        this.targetMethodDesc = targetMethodDesc;
    }

    public byte[] dump() {
        ClassWriter cw = new ClassWriter(0);
        cw.visit(V1_7, ACC_PUBLIC + ACC_SUPER, invokerClassName, null, "java/lang/Object", null);
        visitConstructor(cw);
        visitApplyMethod(cw);
        return cw.toByteArray();
    }

    private void visitConstructor(ClassWriter cw) {
        MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
        mv.visitCode();
        mv.visitVarInsn(ALOAD, 0);
        mv.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
        mv.visitInsn(RETURN);
        mv.visitMaxs(1, 1);
        mv.visitEnd();
    }

    private void visitApplyMethod(ClassWriter cw) {
        MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "apply", targetMethodDesc, null, null);
        mv.visitCode();
        mv.visitVarInsn(ALOAD, 0);
        MethodType mt = MethodType.methodType(CallSite.class, MethodHandles.Lookup.class, String.class, MethodType.class);
        Handle bootstrap = new Handle(H_INVOKESTATIC, linkageClassName, bootstrapMethodName, mt.toMethodDescriptorString(), false);
        mv.visitInvokeDynamicInsn("bsm", targetMethodDesc, bootstrap);
        mv.visitInsn(ARETURN);
        mv.visitMaxs(1, 1);
        mv.visitEnd();
    }
}
