package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.ClassFile;
import com.dnw.whid.vm.cp.AccessFlag;
import com.dnw.whid.vm.cp.ConstClass;
import com.dnw.whid.vm.cp.ConstUtf8;

public final class InnerClassDef {

    public int indexInnerClass;
    public int indexOuterClass;
    public int indexInnerName;
    public final AccessFlag innerAccessFlag = new AccessFlag();

    public InnerClassDef(int indexInnerClass, int indexOuterClass, int indexInnerName) {
        this.indexInnerClass = indexInnerClass;
        this.indexOuterClass = indexOuterClass;
        this.indexInnerName = indexInnerName;
    }

    public ConstClass getInnerClass(ClassFile c) {
        return (ConstClass) c.constPool.items.get(indexInnerClass);
    }

    public ConstClass getOuterClass(ClassFile c) {
        return (ConstClass) c.constPool.items.get(indexOuterClass);
    }

    public String getInnerClassName(ClassFile c) {
        ConstUtf8 utf8 = (ConstUtf8) c.constPool.items.get(indexInnerName);
        return utf8.text;
    }
}
