package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstString;

public final class StringValue extends ConstValue {

    public int indexString;

    public StringValue(int indexName, int indexString) {
        super(indexName);
        this.indexString = indexString;
    }

    public String getValue(ClassFile c) {
        ConstString l = (ConstString) c.constPool.items.get(indexString);
        return l.getString(c);
    }
}
