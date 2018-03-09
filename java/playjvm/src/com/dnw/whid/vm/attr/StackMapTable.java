package com.dnw.whid.vm.attr;

import java.util.ArrayList;
import java.util.List;

public final class StackMapTable extends Attribute {

    public final static String NAME = "StackMapTable";

    public final List<StackMapEntry> entries = new ArrayList<>();

    public StackMapTable(int indexName) {
        super(indexName);
    }
}
