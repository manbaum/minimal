package com.dnw.whid.vm.cp;

public abstract class ConstMethodHandle extends ConstItem {

    public final ReferenceKind kind;

    protected ConstMethodHandle(ReferenceKind kind) {
        super(ConstTag.CONST_MethodHandle);
        this.kind = kind;
    }
}
