package com.dnw.whid.vm.cp;

public final class ConstUtf8 extends ConstItem {

    public final String text;

    public ConstUtf8(String text) {
        super(ConstTag.CONST_Utf8);
        this.text = text;
    }
}
