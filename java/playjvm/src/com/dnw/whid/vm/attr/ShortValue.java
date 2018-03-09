package com.dnw.whid.vm.attr;

        import com.dnw.whid.vm.ClassFile;
        import com.dnw.whid.vm.cp.ConstInteger;

public final class ShortValue extends ConstValue {

    public int indexShort;

    public ShortValue(int indexName, int indexShort) {
        super(indexName);
        this.indexShort = indexShort;
    }

    public short getValue(ClassFile c) {
        ConstInteger l = (ConstInteger) c.constPool.items.get(indexShort);
        return (short) l.value;
    }
}
