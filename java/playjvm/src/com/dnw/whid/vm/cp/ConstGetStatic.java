package com.dnw.whid.vm.cp;

public final class ConstGetStatic extends ConstHandleField {

    public ConstGetStatic(int indexStatic) {
        super(ReferenceKind.getStatic, indexStatic);
    }
}
