package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public abstract class ConstHandleField extends ConstMethodHandle {

    public final int indexField;

    protected ConstHandleField(ReferenceKind kind, int indexField) {
        super(kind);
        this.indexField = indexField;
    }

    public final String getClassDesc(ClassFile c) {
        ConstField field = (ConstField) c.constPool.items.get(indexField);
        return field.getClassDesc(c);
    }

    public final String getName(ClassFile c) {
        ConstField field = (ConstField) c.constPool.items.get(indexField);
        return field.getName(c);
    }

    public final String getTypeDesc(ClassFile c) {
        ConstField field = (ConstField) c.constPool.items.get(indexField);
        return field.getTypeDesc(c);
    }
}
