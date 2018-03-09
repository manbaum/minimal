package com.dnw.whid.vm.cp;

public final class ConstInvokeStatic extends ConstHandleMethod {

    public ConstInvokeStatic(int indexMethod) {
        super(ReferenceKind.invokeStatic, indexMethod);
    }
}
