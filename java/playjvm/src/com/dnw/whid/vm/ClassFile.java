package com.dnw.whid.vm;

import com.dnw.whid.vm.attr.Attribute;
import com.dnw.whid.vm.cp.AccessFlag;
import com.dnw.whid.vm.cp.ConstClass;
import com.dnw.whid.vm.cp.ConstPool;

import java.util.ArrayList;
import java.util.List;

public final class ClassFile {

    public int minorVersion;
    public int majorVersion;
    public final ConstPool constPool = new ConstPool();
    public AccessFlag accessFlag;
    public int indexThisClass;
    public int indexSuperClass;
    public final List<Integer> indexInterfaces = new ArrayList<>();
    public final List<Field> fields = new ArrayList<>();
    public final List<Method> methods = new ArrayList<>();
    public final List<Attribute> attributes = new ArrayList<>();

    public ClassFile() {
    }

    public ClassFile(int minorVersion, int majorVersion) {
        this.minorVersion = minorVersion;
        this.majorVersion = majorVersion;
    }

    public ConstClass getThisClass() {
        return (ConstClass) constPool.items.get(indexThisClass);
    }

    public ConstClass getSuperClass() {
        return (ConstClass) constPool.items.get(indexSuperClass);
    }

    public ConstClass getInterface(int index) {
        int indexInterface = indexInterfaces.get(index);
        return (ConstClass) constPool.items.get(indexInterface);
    }
}
