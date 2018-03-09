package com.dnw.whid.slot;

public class Int64 extends Literal {

    public final long value;

    public Int64(final int value) {
        super(2);
        this.value = value;
    }
}
