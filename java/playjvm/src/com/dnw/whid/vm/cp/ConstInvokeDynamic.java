package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstInvokeDynamic extends ConstItem {

    public final int indexBootstrapMethod;
    public final int indexNameAndType;

    public ConstInvokeDynamic(int indexBootstrapMethod, int indexNameAndType) {
        super(ConstTag.CONST_InvokeDynamic);
        this.indexBootstrapMethod = indexBootstrapMethod;
        this.indexNameAndType = indexNameAndType;
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
