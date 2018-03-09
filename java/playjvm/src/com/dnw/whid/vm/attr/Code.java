package com.dnw.whid.vm.attr;

import com.dnw.whid.vm.inst.Instruction;

import java.util.ArrayList;
import java.util.List;

public final class Code extends Attribute {

    public final static String NAME = "Code";

    public int maxStack;
    public int maxLocals;
    public final List<Instruction> instructions = new ArrayList<>();
    public final List<ExceptionHandler> exceptionHandlers = new ArrayList<>();
    public final List<Attribute> attributes = new ArrayList<>();

    public Code(int indexName) {
        super(indexName);
    }
}
