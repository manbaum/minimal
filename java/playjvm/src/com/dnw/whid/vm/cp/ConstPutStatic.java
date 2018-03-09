package com.dnw.whid.vm.cp;

public final class ConstPutStatic extends ConstHandleField {

    public ConstPutStatic(int indexStatic) {
        super(ReferenceKind.putStatic, indexStatic);
    }
}
