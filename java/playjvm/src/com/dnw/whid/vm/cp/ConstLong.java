package com.dnw.whid.vm.cp;

public final class ConstLong extends ConstItem {

    public final long value;

    public ConstLong(long value) {
        super(ConstTag.CONST_Long);
        this.value = value;
    }
}
