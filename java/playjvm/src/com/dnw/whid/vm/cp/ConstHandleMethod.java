package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public abstract class ConstHandleMethod extends ConstMethodHandle {

    public final int indexMethod;

    protected ConstHandleMethod(ReferenceKind kind, int indexMethod) {
        super(kind);
        this.indexMethod = indexMethod;
    }

    public String getClassDesc(ClassFile c) {
        ConstMethod method = (ConstMethod) c.constPool.items.get(indexMethod);
        return method.getClassDesc(c);
    }

    public String getName(ClassFile c) {
        ConstMethod method = (ConstMethod) c.constPool.items.get(indexMethod);
        return method.getName(c);
    }

    public String getTypeDesc(ClassFile c) {
        ConstMethod method = (ConstMethod) c.constPool.items.get(indexMethod);
        return method.getTypeDesc(c);
    }
}
