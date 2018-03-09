package com.dnw.whid.vm.cp;

public final class ConstDouble extends ConstItem {

    public final double value;

    public ConstDouble(double value) {
        super(ConstTag.CONST_Double);
        this.value = value;
    }
}
