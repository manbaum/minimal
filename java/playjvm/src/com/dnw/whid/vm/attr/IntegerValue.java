package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstInteger;

public final class IntegerValue extends ConstValue {

    public int indexInteger;

    public IntegerValue(int indexName, int indexInteger) {
        super(indexName);
        this.indexInteger = indexInteger;
    }

    public int getValue(ClassFile c) {
        ConstInteger l = (ConstInteger) c.constPool.items.get(indexInteger);
        return l.value;
    }
}
