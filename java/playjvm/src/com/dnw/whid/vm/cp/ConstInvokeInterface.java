package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstInvokeInterface extends ConstMethodHandle {

    public final int indexIntMethod;

    public ConstInvokeInterface(int indexIntMethod) {
        super(ReferenceKind.invokeInterface);
        this.indexIntMethod = indexIntMethod;
    }

    public String getClassDesc(ClassFile c) {
        ConstIntMethod method = (ConstIntMethod) c.constPool.items.get(indexIntMethod);
        return method.getClassDesc(c);
    }

    public String getName(ClassFile c) {
        ConstIntMethod method = (ConstIntMethod) c.constPool.items.get(indexIntMethod);
        return method.getName(c);
    }

    public String getTypeDesc(ClassFile c) {
        ConstIntMethod method = (ConstIntMethod) c.constPool.items.get(indexIntMethod);
        return method.getTypeDesc(c);
    }
}
