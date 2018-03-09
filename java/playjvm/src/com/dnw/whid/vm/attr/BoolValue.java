package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstInteger;

public final class BoolValue extends ConstValue {

    public int indexBool;

    public BoolValue(int indexName, int indexBool) {
        super(indexName);
        this.indexBool = indexBool;
    }

    public boolean getValue(ClassFile c) {
        ConstInteger l = (ConstInteger) c.constPool.items.get(indexBool);
        return l.value != 0;
    }
}
