package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstClass extends ConstItem {

    public final int indexClassName;

    public ConstClass(int indexClassName) {
        super(ConstTag.CONST_Class);
        this.indexClassName = indexClassName;
    }

    public String getClassDesc(ClassFile c) {
        ConstUtf8 utf8 = (ConstUtf8) c.constPool.items.get(indexClassName);
        return utf8.text;
    }
}
