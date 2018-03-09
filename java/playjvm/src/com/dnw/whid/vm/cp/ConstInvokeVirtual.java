package com.dnw.whid.vm.cp;

public final class ConstInvokeVirtual extends ConstHandleMethod {

    public ConstInvokeVirtual(int indexMethod) {
        super(ReferenceKind.invokeVirtual, indexMethod);
    }
}
