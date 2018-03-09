package com.dnw.whid.vm.cp;

public final class ReferenceKind {

    public final int kind;

    private ReferenceKind(int kind) {
        this.kind = kind;
    }

    public static ReferenceKind valueOf(int kind) {
        switch (kind) {
            case 1:
                return getField;
            case 2:
                return getStatic;
            case 3:
                return putField;
            case 4:
                return putStatic;
            case 5:
                return invokeVirtual;
            case 6:
                return invokeStatic;
            case 7:
                return invokeSpecial;
            case 8:
                return newInvokeSpecial;
            case 9:
                return invokeInterface;
            default:
                throw new IllegalArgumentException("kind: " + kind);
        }
    }

    public final static ReferenceKind getField = new ReferenceKind(1);
    public final static ReferenceKind getStatic = new ReferenceKind(2);
    public final static ReferenceKind putField = new ReferenceKind(3);
    public final static ReferenceKind putStatic = new ReferenceKind(4);
    public final static ReferenceKind invokeVirtual = new ReferenceKind(5);
    public final static ReferenceKind invokeStatic = new ReferenceKind(6);
    public final static ReferenceKind invokeSpecial = new ReferenceKind(7);
    public final static ReferenceKind newInvokeSpecial = new ReferenceKind(8);
    public final static ReferenceKind invokeInterface = new ReferenceKind(9);
}
