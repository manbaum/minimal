package com.dnw.whid.vm;

import com.dnw.whid.slot.Slot;

public final class Frame {

    public Slot[] localVars;
    public Slot[] arguments;

    public Frame(final String codeName, final int pc, final int numVars) {
        localVars = numVars > 0 ? new Slot[numVars] : null;
    }
}
