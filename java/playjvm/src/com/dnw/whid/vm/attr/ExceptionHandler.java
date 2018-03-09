package com.dnw.whid.vm.attr;

public final class ExceptionHandler {

    public int startPC;
    public int endPC;
    public int handlerPC;
    public int indexCatchTypeDesc;

    public ExceptionHandler() {
    }

    public ExceptionHandler(int startPC, int endPC, int handlerPC, int indexCatchTypeDesc) {
        this.startPC = startPC;
        this.endPC = endPC;
        this.handlerPC = handlerPC;
        this.indexCatchTypeDesc = indexCatchTypeDesc;
    }
}
