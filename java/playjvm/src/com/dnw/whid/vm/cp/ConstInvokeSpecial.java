package com.dnw.whid.vm.cp;

public final class ConstInvokeSpecial extends ConstHandleMethod {

    public ConstInvokeSpecial(int indexMethod) {
        super(ReferenceKind.invokeSpecial, indexMethod);
    }
}
