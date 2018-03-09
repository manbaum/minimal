package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstUtf8;

public abstract class Attribute {

    public int indexName;

    protected Attribute(int indexName) {
        this.indexName = indexName;
    }

    public final String getName(ClassFile clazz) {
        ConstUtf8 utf8 = (ConstUtf8) clazz.constPool.items.get(indexName);
        return utf8.text;
    }
}
