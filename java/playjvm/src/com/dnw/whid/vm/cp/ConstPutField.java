package com.dnw.whid.vm.cp;

public final class ConstPutField extends ConstHandleField {

    public ConstPutField(int indexField) {
        super(ReferenceKind.putField, indexField);
    }
}
