package com.dnw.whid.vm.cp;

public final class ConstTag {

    public final int tag;

    private ConstTag(int tag) {
        this.tag = tag;
    }

    public final static ConstTag valueOf(int tag) {
        switch (tag) {
            case 1:
                return CONST_Utf8;
            case 3:
                return CONST_Integer;
            case 4:
                return CONST_Float;
            case 5:
                return CONST_Long;
            case 6:
                return CONST_Double;
            case 7:
                return CONST_Class;
            case 8:
                return CONST_String;
            case 9:
                return CONST_FieldRef;
            case 10:
                return CONST_MethodRef;
            case 11:
                return CONST_IntMethodRef;
            case 12:
                return CONST_NameAndType;
            case 15:
                return CONST_MethodHandle;
            case 16:
                return CONST_MethodType;
            case 18:
                return CONST_InvokeDynamic;
            default:
                throw new IllegalArgumentException("tag: " + tag);
        }
    }

    public final static ConstTag CONST_Utf8 = new ConstTag(1);
    public final static ConstTag CONST_Integer = new ConstTag(3);
    public final static ConstTag CONST_Float = new ConstTag(4);
    public final static ConstTag CONST_Long = new ConstTag(5);
    public final static ConstTag CONST_Double = new ConstTag(6);
    public final static ConstTag CONST_Class = new ConstTag(7);
    public final static ConstTag CONST_String = new ConstTag(8);
    public final static ConstTag CONST_FieldRef = new ConstTag(9);
    public final static ConstTag CONST_MethodRef = new ConstTag(10);
    public final static ConstTag CONST_IntMethodRef = new ConstTag(11);
    public final static ConstTag CONST_NameAndType = new ConstTag(12);
    public final static ConstTag CONST_MethodHandle = new ConstTag(15);
    public final static ConstTag CONST_MethodType = new ConstTag(16);
    public final static ConstTag CONST_InvokeDynamic = new ConstTag(18);
}
