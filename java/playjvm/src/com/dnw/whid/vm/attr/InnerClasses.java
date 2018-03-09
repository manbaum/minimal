package com.dnw.whid.vm.attr;

import java.util.ArrayList;
import java.util.List;

public final class InnerClasses extends Attribute {

    public final static String NAME = "InnerClasses";

    public final List<InnerClassDef> classes = new ArrayList<>();

    public InnerClasses(int indexName) {
        super(indexName);
    }
}
