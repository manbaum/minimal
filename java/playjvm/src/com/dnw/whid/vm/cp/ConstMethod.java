package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstMethod extends ConstItem {

    public final int indexClass;
    public final int indexNameAndType;

    public ConstMethod(int indexClass, int indexNameAndType) {
        super(ConstTag.CONST_MethodRef);
        this.indexClass = indexClass;
        this.indexNameAndType = indexNameAndType;
    }

    public String getClassDesc(ClassFile c) {
        ConstClass clazz = (ConstClass) c.constPool.items.get(indexClass);
        return clazz.getClassDesc(c);
    }

    public String getName(ClassFile c) {
        ConstNameAndType nameAndType = (ConstNameAndType) c.constPool.items.get(indexNameAndType);
        return nameAndType.getName(c);
    }

    public String getTypeDesc(ClassFile c) {
        ConstNameAndType nameAndType = (ConstNameAndType) c.constPool.items.get(indexNameAndType);
        return nameAndType.getTypeDesc(c);
    }
}
