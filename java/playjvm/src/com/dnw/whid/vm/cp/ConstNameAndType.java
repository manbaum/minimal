package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstNameAndType extends ConstItem {

    public final int indexName;
    public final int indexTypeDesc;

    public ConstNameAndType(int indexName, int indexTypeDesc) {
        super(ConstTag.CONST_NameAndType);
        this.indexName = indexName;
        this.indexTypeDesc = indexTypeDesc;
    }

    public String getName(ClassFile c) {
        ConstUtf8 utf8 = (ConstUtf8) c.constPool.items.get(indexName);
        return utf8.text;
    }

    public String getTypeDesc(ClassFile c) {
        ConstUtf8 utf8 = (ConstUtf8) c.constPool.items.get(indexTypeDesc);
        return utf8.text;
    }
}
