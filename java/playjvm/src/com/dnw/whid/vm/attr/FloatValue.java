package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstFloat;

public final class FloatValue extends ConstValue {

    public int indexFloat;

    public FloatValue(int indexName, int indexFloat) {
        super(indexName);
        this.indexFloat = indexFloat;
    }

    public float getValue(ClassFile c) {
        ConstFloat l = (ConstFloat) c.constPool.items.get(indexFloat);
        return l.value;
    }
}
