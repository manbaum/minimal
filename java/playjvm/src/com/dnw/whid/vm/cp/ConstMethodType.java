package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstMethodType extends ConstItem {

    public final int indexTypeDesc;

    public ConstMethodType(int indexTypeDesc) {
        super(ConstTag.CONST_MethodType);
        this.indexTypeDesc = indexTypeDesc;
    }

    public String getTypeDesc(ClassFile c) {
        ConstUtf8 utf8 = (ConstUtf8) c.constPool.items.get(indexTypeDesc);
        return utf8.text;
    }
}
