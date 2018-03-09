package com.dnw.whid.vm.inst;

import com.dnw.whid.vm.VMachine;

public abstract class Instruction {

    public final int opCode;

    protected Instruction(int opCode) {
        this.opCode = opCode;
    }

    public abstract void execute(VMachine vm);
}
