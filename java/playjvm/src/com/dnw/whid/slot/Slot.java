package com.dnw.whid.slot;

public abstract class Slot {

    public final int typeId;

    protected Slot(final int typeId) {
        this.typeId = typeId;
    }
}
