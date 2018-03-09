package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.ConstClass;

import java.util.ArrayList;
import java.util.List;

public final class Exceptions extends Attribute {

    public final static String NAME = "Exceptions";

    public final List<Integer> exceptions = new ArrayList<>();

    public Exceptions(int indexName) {
        super(indexName);
    }

    public ConstClass getExceptionClass(ClassFile c, int index) {
        int indexClass = exceptions.get(index);
        return (ConstClass) c.constPool.items.get(indexClass);
    }
}
