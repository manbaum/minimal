package com.dnw.whid.vm.cp;

import java.util.ArrayList;
import java.util.List;

public final class ConstPool {

    public final List<ConstItem> items = new ArrayList<>();

    public ConstPool() {
        items.add(null);
    }
}
