package com.dnw.whid.vm.cp;

import com.dnw.whid.vm.ClassFile;

public final class ConstString extends ConstItem {

    public final int indexString;

    public ConstString(int indexString) {
        super(ConstTag.CONST_String);
        this.indexString = indexString;
    }

    public String getString(ClassFile c) {
        ConstUtf8 utf8 = (ConstUtf8) c.constPool.items.get(indexString);
        return utf8.text;
    }
}
