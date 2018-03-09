package com.dnw.whid.vm;

import com.dnw.whid.vm.attr.Attribute;
import com.dnw.whid.vm.cp.AccessFlag;

import java.util.ArrayList;
import java.util.List;

public final class Method {

    public final AccessFlag accessFlag = new AccessFlag();
    public int indexName;
    public int indexTypeDesc;
    public final List<Attribute> attributes = new ArrayList<>();

    public Method(int indexName, int indexTypeDesc) {
        this.indexName = indexName;
        this.indexTypeDesc = indexTypeDesc;
    }
}
