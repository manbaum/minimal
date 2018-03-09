package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstDouble;

public final class DoubleValue extends ConstValue {

    public int indexDouble;

    public DoubleValue(int indexName, int indexDouble) {
        super(indexName);
        this.indexDouble = indexDouble;
    }

    public double getValue(ClassFile c) {
        ConstDouble l = (ConstDouble) c.constPool.items.get(indexDouble);
        return l.value;
    }
}
