package com.dnw.whid.vm.cp;

public final class ConstFloat extends ConstItem {

    public final float value;

    public ConstFloat(float value) {
        super(ConstTag.CONST_Float);
        this.value = value;
    }
}
