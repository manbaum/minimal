package com.dnw.whid.slot;

public class UInt8 extends Literal {

    public final byte value;

    public UInt8(final byte value) {
        super(1);
        this.value = value;
    }
}
