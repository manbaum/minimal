package com.dnw.whid.vm.cp;

public final class ConstNewInvokeSpecial extends ConstHandleMethod {

    public ConstNewInvokeSpecial(int indexMethod) {
        super(ReferenceKind.newInvokeSpecial, indexMethod);
    }
}
