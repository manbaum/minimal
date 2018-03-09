package com.dnw.whid.slot;

public class Bool extends Literal {

    public final boolean value;

    public Bool(final boolean value) {
        super(3);
        this.value = value;
    }
}
