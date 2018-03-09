package com.dnw.whid.vm.cp;

public final class ConstInteger extends ConstItem {

    public final int value;

    public ConstInteger(int value) {
        super(ConstTag.CONST_Integer);
        this.value = value;
    }
}
