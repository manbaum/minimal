package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstLong;

public final class LongValue extends ConstValue {

    public int indexLong;

    public LongValue(int indexName, int indexLong) {
        super(indexName);
        this.indexLong = indexLong;
    }

    public long getValue(ClassFile c) {
        ConstLong l = (ConstLong) c.constPool.items.get(indexLong);
        return l.value;
    }
}
