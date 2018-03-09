package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstInteger;

public final class CharValue extends ConstValue {

    public int indexChar;

    public CharValue(int indexName, int indexChar) {
        super(indexName);
        this.indexChar = indexChar;
    }

    public char getValue(ClassFile c) {
        ConstInteger l = (ConstInteger) c.constPool.items.get(indexChar);
        return (char) l.value;
    }
}
