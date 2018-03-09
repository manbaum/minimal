package com.dnw.whid.vm.cp;

public final class AccessFlag {

    public final static int PUBLIC = 0x0001;
    public final static int PRIVATE = 0x0002;
    public final static int PROTECTED = 0x0004;
    public final static int STATIC = 0x0008;
    public final static int FINAL = 0x0010;
    public final static int SUPER = 0x0020;
    public final static int SYNCHRONIZED = 0x0020;
    public final static int BRIDGE = 0x0040;
    public final static int VOLATILE = 0x0040;
    public final static int TRANSIENT = 0x0080;
    public final static int VARARGS = 0x0080;
    public final static int NATIVE = 0x0100;
    public final static int INTERFACE = 0x0200;
    public final static int ABSTRACT = 0x0400;
    public final static int STRICT = 0x0800;
    public final static int SYNTHETIC = 0x1000;
    public final static int ANNOTATION = 0x2000;
    public final static int ENUM = 0x4000;

    public static int numberOfSetBits(int i) {
        i = i - ((i >>> 1) & 0x55555555);
        i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
        return (((i + (i >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
    }

    public int value;

    public AccessFlag() {
    }

    public AccessFlag(int value) {
        this.value = value;
    }

    public boolean isPublic() {
        return (value & PUBLIC) != 0;
    }

    public boolean isPrivate() {
        return (value & PRIVATE) != 0;
    }

    public boolean isProtected() {
        return (value & PROTECTED) != 0;
    }

    public boolean isStatic() {
        return (value & STATIC) != 0;
    }

    public boolean isSuper() {
        return (value & SUPER) != 0;
    }

    public boolean isFinal() {
        return (value & FINAL) != 0;
    }

    public boolean isSynchronized() {
        return (value & SYNCHRONIZED) != 0;
    }

    public boolean isBridge() {
        return (value & BRIDGE) != 0;
    }

    public boolean isVolatile() {
        return (value & VOLATILE) != 0;
    }

    public boolean isTransient() {
        return (value & TRANSIENT) != 0;
    }

    public boolean isVarArgs() {
        return (value & VARARGS) != 0;
    }

    public boolean isNative() {
        return (value & NATIVE) != 0;
    }

    public boolean isInterface() {
        return (value & INTERFACE) != 0;
    }

    public boolean isAbstract() {
        return (value & ABSTRACT) != 0;
    }

    public boolean isStrict() {
        return (value & STRICT) != 0;
    }

    public boolean isSynthetic() {
        return (value & SYNTHETIC) != 0;
    }

    public boolean isAnnotation() {
        return (value & ANNOTATION) != 0;
    }

    public boolean isEnum() {
        return (value & ENUM) != 0;
    }

    public AccessFlag setPublic() {
        value |= PUBLIC;
        return this;
    }

    public AccessFlag setPrivate() {
        value |= PRIVATE;
        return this;
    }

    public AccessFlag setProtected() {
        value |= PROTECTED;
        return this;
    }

    public AccessFlag setStatic() {
        value |= STATIC;
        return this;
    }

    public AccessFlag setFinal() {
        value |= FINAL;
        return this;
    }

    public AccessFlag setSuper() {
        value |= SUPER;
        return this;
    }

    public AccessFlag setSynchronized() {
        value |= SYNCHRONIZED;
        return this;
    }

    public AccessFlag setBridge() {
        value |= BRIDGE;
        return this;
    }

    public AccessFlag setVolatile() {
        value |= VOLATILE;
        return this;
    }

    public AccessFlag setTransient() {
        value |= TRANSIENT;
        return this;
    }

    public AccessFlag setVarArgs() {
        value |= VARARGS;
        return this;
    }

    public AccessFlag setNative() {
        value |= NATIVE;
        return this;
    }

    public AccessFlag setInterface() {
        value |= INTERFACE;
        return this;
    }

    public AccessFlag setAbstract() {
        value |= ABSTRACT;
        return this;
    }

    public AccessFlag setStrict() {
        value |= STRICT;
        return this;
    }

    public AccessFlag setSynthetic() {
        value |= SYNTHETIC;
        return this;
    }

    public AccessFlag setAnnotation() {
        value |= ANNOTATION;
        return this;
    }

    public AccessFlag setEnum() {
        value |= ENUM;
        return this;
    }

    public AccessFlag resetPublic() {
        value &= ~PUBLIC;
        return this;
    }

    public AccessFlag resetPrivate() {
        value &= ~PRIVATE;
        return this;
    }

    public AccessFlag resetProtected() {
        value &= ~PROTECTED;
        return this;
    }

    public AccessFlag resetStatic() {
        value &= ~STATIC;
        return this;
    }

    public AccessFlag resetFinal() {
        value &= ~FINAL;
        return this;
    }

    public AccessFlag resetSuper() {
        value &= ~SUPER;
        return this;
    }

    public AccessFlag resetSynchronized() {
        value &= ~SYNCHRONIZED;
        return this;
    }

    public AccessFlag resetBridge() {
        value &= ~BRIDGE;
        return this;
    }

    public AccessFlag resetVolatile() {
        value &= ~VOLATILE;
        return this;
    }

    public AccessFlag resetTransient() {
        value &= ~TRANSIENT;
        return this;
    }

    public AccessFlag resetVarArgs() {
        value &= ~VARARGS;
        return this;
    }

    public AccessFlag resetNative() {
        value &= ~NATIVE;
        return this;
    }

    public AccessFlag resetInterface() {
        value &= ~INTERFACE;
        return this;
    }

    public AccessFlag resetAbstract() {
        value &= ~ABSTRACT;
        return this;
    }

    public AccessFlag resetStrict() {
        value &= ~STRICT;
        return this;
    }

    public AccessFlag resetSynthetic() {
        value &= ~SYNTHETIC;
        return this;
    }

    public AccessFlag resetAnnotation() {
        value &= ~ANNOTATION;
        return this;
    }

    public AccessFlag resetEnum() {
        value &= ~ENUM;
        return this;
    }
}
