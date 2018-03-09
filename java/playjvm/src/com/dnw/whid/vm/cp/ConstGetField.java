package com.dnw.whid.vm.cp;

public final class ConstGetField extends ConstHandleField {

    public ConstGetField(int indexField) {
        super(ReferenceKind.getField, indexField);
    }
}
