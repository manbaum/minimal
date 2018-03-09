package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstInteger;

public final class ByteValue extends ConstValue {

    public int indexByte;

    public ByteValue(int indexName, int indexByte) {
        super(indexName);
        this.indexByte = indexByte;
    }

    public byte getValue(ClassFile c) {
        ConstInteger l = (ConstInteger) c.constPool.items.get(indexByte);
        return (byte) l.value;
    }
}
