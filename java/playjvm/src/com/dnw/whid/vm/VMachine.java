package com.dnw.whid.vm;

import java.util.HashMap;
import java.util.Map;

public final class VMachine implements OpCode {

    public final Map<String, ClassFile> codeMap = new HashMap<>();
    public final Stack<Frame> frames = new Stack<>();

    public Frame frame;

    public ClassFile code;
    public int pc;
    public Stack<Integer> operands = new Stack<>();


    private int readUByte() {
        return (int) (code.octets[pc++] & 0xff);
    }

    private int readByte() {
        return (int) code.octets[pc++];
    }

    private int readUShort() {
        int b1 = code.octets[pc++] & 0xff;
        int b2 = code.octets[pc++] & 0xff;
        return (b1 << 8) | b2;
    }

    private int readShort() {
        int b1 = code.octets[pc++];
        int b2 = code.octets[pc++] & 0xff;
        return (b1 << 8) | b2;
    }

    private void loadConst(int index) {

    }


    public void step() {
        int b1, b2, b3, b4;
        int opcode = code.octets[pc++];
        switch (opcode) {
            case NOP: // 0
                break;
            case ACONST_NULL: // 1
                operands.push(0);
                break;
            case ICONST_M1: // 2
                operands.push(-1);
                break;
            case ICONST_0: // 3
                operands.push(0);
                break;
            case ICONST_1: // 4
                operands.push(1);
                break;
            case ICONST_2: // 5
                operands.push(2);
                break;
            case ICONST_3: // 6
                operands.push(3);
                break;
            case ICONST_4: // 7
                operands.push(4);
                break;
            case ICONST_5: // 8
                operands.push(5);
                break;
            case LCONST_0: // 9
                operands.push(0);
                operands.push(0);
                break;
            case LCONST_1: // 10
                operands.push(0);
                operands.push(1);
                break;
            case FCONST_0: // 11
                operands.push(0);
                break;
            case FCONST_1: // 12
                operands.push(0x3f800000);
                break;
            case FCONST_2: // 13
                operands.push(0x40000000);
                break;
            case DCONST_0: // 14
                operands.push(0);
                operands.push(0);
                break;
            case DCONST_1: // 15
                operands.push(0x3ff00000);
                operands.push(0);
                break;
            case BIPUSH: // 16
                b1 = code.octets[pc++];
                operands.push(b1);
                break;
            case SIPUSH: // 17
                b1 = code.octets[pc++];
                b2 = code.octets[pc++] & 0xff;
                operands.push((b1 << 8) | b2);
                break;
            case LDC: // 18
                b1 = code.octets[pc++];
                throw new VMUnsupportedOperationException("LDC(18)");
                // break;
            case LDC_W: // 19
                throw new VMUnsupportedOperationException("LDC_W(19)");
                // break;
            case LDC2_W: // 20
                throw new VMUnsupportedOperationException("LDC2_W(20)");
                // break;
            case ILOAD: // 21
                throw new VMUnsupportedOperationException("ILOAD(21)");
                // break;
            case LLOAD: // 22
                throw new VMUnsupportedOperationException("LLOAD(22)");
                // break;
            case FLOAD: // 23
                throw new VMUnsupportedOperationException("FLOAD(23)");
                // break;
            case DLOAD: // 24
                throw new VMUnsupportedOperationException("DLOAD(24)");
                // break;
            case ALOAD: // 25
                throw new VMUnsupportedOperationException("ALOAD(25)");
                // break;
            case ILOAD_0: // 26
                throw new VMUnsupportedOperationException("ILOAD_0(26)");
                // break;
            case ILOAD_1: // 27
                throw new VMUnsupportedOperationException("ILOAD_1(27)");
                // break;
            case ILOAD_2: // 28
                throw new VMUnsupportedOperationException("ILOAD_2(28)");
                // break;
            case ILOAD_3: // 29
                throw new VMUnsupportedOperationException("ILOAD_3(29)");
                // break;
            case LLOAD_0: // 30
                throw new VMUnsupportedOperationException("LLOAD_0(30)");
                // break;
            case LLOAD_1: // 31
                throw new VMUnsupportedOperationException("LLOAD_1(31)");
                // break;
            case LLOAD_2: // 32
                throw new VMUnsupportedOperationException("LLOAD_2(32)");
                // break;
            case LLOAD_3: // 33
                throw new VMUnsupportedOperationException("LLOAD_3(33)");
                // break;
            case FLOAD_0: // 34
                throw new VMUnsupportedOperationException("FLOAD_0(34)");
                // break;
            case FLOAD_1: // 35
                throw new VMUnsupportedOperationException("FLOAD_1(35)");
                // break;
            case FLOAD_2: // 36
                throw new VMUnsupportedOperationException("FLOAD_2(36)");
                // break;
            case FLOAD_3: // 37
                throw new VMUnsupportedOperationException("FLOAD_3(37)");
                // break;
            case DLOAD_0: // 38
                throw new VMUnsupportedOperationException("DLOAD_0(38)");
                // break;
            case DLOAD_1: // 39
                throw new VMUnsupportedOperationException("DLOAD_1(39)");
                // break;
            case DLOAD_2: // 40
                throw new VMUnsupportedOperationException("DLOAD_2(40)");
                // break;
            case DLOAD_3: // 41
                throw new VMUnsupportedOperationException("DLOAD_3(41)");
                // break;
            case ALOAD_0: // 42
                throw new VMUnsupportedOperationException("ALOAD_0(42)");
                // break;
            case ALOAD_1: // 43
                throw new VMUnsupportedOperationException("ALOAD_1(43)");
                // break;
            case ALOAD_2: // 44
                throw new VMUnsupportedOperationException("ALOAD_2(44)");
                // break;
            case ALOAD_3: // 45
                throw new VMUnsupportedOperationException("ALOAD_3(45)");
                // break;
            case IALOAD: // 46
                throw new VMUnsupportedOperationException("IALOAD(46)");
                // break;
            case LALOAD: // 47
                throw new VMUnsupportedOperationException("LALOAD(47)");
                // break;
            case FALOAD: // 48
                throw new VMUnsupportedOperationException("FALOAD(48)");
                // break;
            case DALOAD: // 49
                throw new VMUnsupportedOperationException("DALOAD(49)");
                // break;
            case AALOAD: // 50
                throw new VMUnsupportedOperationException("AALOAD(50)");
                // break;
            case BALOAD: // 51
                throw new VMUnsupportedOperationException("BALOAD(51)");
                // break;
            case CALOAD: // 52
                throw new VMUnsupportedOperationException("CALOAD(52)");
                // break;
            case SALOAD: // 53
                throw new VMUnsupportedOperationException("SALOAD(53)");
                // break;
            case ISTORE: // 54
                throw new VMUnsupportedOperationException("ISTORE(54)");
                // break;
            case LSTORE: // 55
                throw new VMUnsupportedOperationException("LSTORE(55)");
                // break;
            case FSTORE: // 56
                throw new VMUnsupportedOperationException("FSTORE(56)");
                // break;
            case DSTORE: // 57
                throw new VMUnsupportedOperationException("DSTORE(57)");
                // break;
            case ASTORE: // 58
                throw new VMUnsupportedOperationException("ASTORE(58)");
                // break;
            case ISTORE_0: // 59
                throw new VMUnsupportedOperationException("ISTORE_0(59)");
                // break;
            case ISTORE_1: // 60
                throw new VMUnsupportedOperationException("ISTORE_1(60)");
                // break;
            case ISTORE_2: // 61
                throw new VMUnsupportedOperationException("ISTORE_2(61)");
                // break;
            case ISTORE_3: // 62
                throw new VMUnsupportedOperationException("ISTORE_3(62)");
                // break;
            case LSTORE_0: // 63
                throw new VMUnsupportedOperationException("LSTORE_0(63)");
                // break;
            case LSTORE_1: // 64
                throw new VMUnsupportedOperationException("LSTORE_1(64)");
                // break;
            case LSTORE_2: // 65
                throw new VMUnsupportedOperationException("LSTORE_2(65)");
                // break;
            case LSTORE_3: // 66
                throw new VMUnsupportedOperationException("LSTORE_3(66)");
                // break;
            case FSTORE_0: // 67
                throw new VMUnsupportedOperationException("FSTORE_0(67)");
                // break;
            case FSTORE_1: // 68
                throw new VMUnsupportedOperationException("FSTORE_1(68)");
                // break;
            case FSTORE_2: // 69
                throw new VMUnsupportedOperationException("FSTORE_2(69)");
                // break;
            case FSTORE_3: // 70
                throw new VMUnsupportedOperationException("FSTORE_3(70)");
                // break;
            case DSTORE_0: // 71
                throw new VMUnsupportedOperationException("DSTORE_0(71)");
                // break;
            case DSTORE_1: // 72
                throw new VMUnsupportedOperationException("DSTORE_1(72)");
                // break;
            case DSTORE_2: // 73
                throw new VMUnsupportedOperationException("DSTORE_2(73)");
                // break;
            case DSTORE_3: // 74
                throw new VMUnsupportedOperationException("DSTORE_3(74)");
                // break;
            case ASTORE_0: // 75
                throw new VMUnsupportedOperationException("ASTORE_0(75)");
                // break;
            case ASTORE_1: // 76
                throw new VMUnsupportedOperationException("ASTORE_1(76)");
                // break;
            case ASTORE_2: // 77
                throw new VMUnsupportedOperationException("ASTORE_2(77)");
                // break;
            case ASTORE_3: // 78
                throw new VMUnsupportedOperationException("ASTORE_3(78)");
                // break;
            case IASTORE: // 79
                throw new VMUnsupportedOperationException("IASTORE(79)");
                // break;
            case LASTORE: // 80
                throw new VMUnsupportedOperationException("LASTORE(80)");
                // break;
            case FASTORE: // 81
                throw new VMUnsupportedOperationException("FASTORE(81)");
                // break;
            case DASTORE: // 82
                throw new VMUnsupportedOperationException("DASTORE(82)");
                // break;
            case AASTORE: // 83
                throw new VMUnsupportedOperationException("AASTORE(83)");
                // break;
            case BASTORE: // 84
                throw new VMUnsupportedOperationException("BASTORE(84)");
                // break;
            case CASTORE: // 85
                throw new VMUnsupportedOperationException("CASTORE(85)");
                // break;
            case SASTORE: // 86
                throw new VMUnsupportedOperationException("SASTORE(86)");
                // break;
            case POP: // 87
                throw new VMUnsupportedOperationException("POP(87)");
                // break;
            case POP2: // 88
                throw new VMUnsupportedOperationException("POP2(88)");
                // break;
            case DUP: // 89
                throw new VMUnsupportedOperationException("DUP(89)");
                // break;
            case DUP_X1: // 90
                throw new VMUnsupportedOperationException("DUP_X1(90)");
                // break;
            case DUP_X2: // 91
                throw new VMUnsupportedOperationException("DUP_X2(91)");
                // break;
            case DUP2: // 92
                throw new VMUnsupportedOperationException("DUP2(92)");
                // break;
            case DUP2_X1: // 93
                throw new VMUnsupportedOperationException("DUP2_X1(93)");
                // break;
            case DUP2_X2: // 94
                throw new VMUnsupportedOperationException("DUP2_X2(94)");
                // break;
            case SWAP: // 95
                throw new VMUnsupportedOperationException("SWAP(95)");
                // break;
            case IADD: // 96
                throw new VMUnsupportedOperationException("IADD(96)");
                // break;
            case LADD: // 97
                throw new VMUnsupportedOperationException("LADD(97)");
                // break;
            case FADD: // 98
                throw new VMUnsupportedOperationException("FADD(98)");
                // break;
            case DADD: // 99
                throw new VMUnsupportedOperationException("DADD(99)");
                // break;
            case ISUB: // 100
                throw new VMUnsupportedOperationException("ISUB(100)");
                // break;
            case LSUB: // 101
                throw new VMUnsupportedOperationException("LSUB(101)");
                // break;
            case FSUB: // 102
                throw new VMUnsupportedOperationException("FSUB(102)");
                // break;
            case DSUB: // 103
                throw new VMUnsupportedOperationException("DSUB(103)");
                // break;
            case IMUL: // 104
                throw new VMUnsupportedOperationException("IMUL(104)");
                // break;
            case LMUL: // 105
                throw new VMUnsupportedOperationException("LMUL(105)");
                // break;
            case FMUL: // 106
                throw new VMUnsupportedOperationException("FMUL(106)");
                // break;
            case DMUL: // 107
                throw new VMUnsupportedOperationException("DMUL(107)");
                // break;
            case IDIV: // 108
                throw new VMUnsupportedOperationException("IDIV(108)");
                // break;
            case LDIV: // 109
                throw new VMUnsupportedOperationException("LDIV(109)");
                // break;
            case FDIV: // 110
                throw new VMUnsupportedOperationException("FDIV(110)");
                // break;
            case DDIV: // 111
                throw new VMUnsupportedOperationException("DDIV(111)");
                // break;
            case IREM: // 112
                throw new VMUnsupportedOperationException("IREM(112)");
                // break;
            case LREM: // 113
                throw new VMUnsupportedOperationException("LREM(113)");
                // break;
            case FREM: // 114
                throw new VMUnsupportedOperationException("FREM(114)");
                // break;
            case DREM: // 115
                throw new VMUnsupportedOperationException("DREM(115)");
                // break;
            case INEG: // 116
                throw new VMUnsupportedOperationException("INEG(116)");
                // break;
            case LNEG: // 117
                throw new VMUnsupportedOperationException("LNEG(117)");
                // break;
            case FNEG: // 118
                throw new VMUnsupportedOperationException("FNEG(118)");
                // break;
            case DNEG: // 119
                throw new VMUnsupportedOperationException("DNEG(119)");
                // break;
            case ISHL: // 120
                throw new VMUnsupportedOperationException("ISHL(120)");
                // break;
            case LSHL: // 121
                throw new VMUnsupportedOperationException("LSHL(121)");
                // break;
            case ISHR: // 122
                throw new VMUnsupportedOperationException("ISHR(122)");
                // break;
            case LSHR: // 123
                throw new VMUnsupportedOperationException("LSHR(123)");
                // break;
            case IUSHR: // 124
                throw new VMUnsupportedOperationException("IUSHR(124)");
                // break;
            case LUSHR: // 125
                throw new VMUnsupportedOperationException("LUSHR(125)");
                // break;
            case IAND: // 126
                throw new VMUnsupportedOperationException("IAND(126)");
                // break;
            case LAND: // 127
                throw new VMUnsupportedOperationException("LAND(127)");
                // break;
            case IOR: // 128
                throw new VMUnsupportedOperationException("IOR(128)");
                // break;
            case LOR: // 129
                throw new VMUnsupportedOperationException("LOR(129)");
                // break;
            case IXOR: // 130
                throw new VMUnsupportedOperationException("IXOR(130)");
                // break;
            case LXOR: // 131
                throw new VMUnsupportedOperationException("LXOR(131)");
                // break;
            case IINC: // 132
                throw new VMUnsupportedOperationException("IINC(132)");
                // break;
            case I2L: // 133
                throw new VMUnsupportedOperationException("I2L(133)");
                // break;
            case I2F: // 134
                throw new VMUnsupportedOperationException("I2F(134)");
                // break;
            case I2D: // 135
                throw new VMUnsupportedOperationException("I2D(135)");
                // break;
            case L2I: // 136
                throw new VMUnsupportedOperationException("L2I(136)");
                // break;
            case L2F: // 137
                throw new VMUnsupportedOperationException("L2F(137)");
                // break;
            case L2D: // 138
                throw new VMUnsupportedOperationException("L2D(138)");
                // break;
            case F2I: // 139
                throw new VMUnsupportedOperationException("F2I(139)");
                // break;
            case F2L: // 140
                throw new VMUnsupportedOperationException("F2L(140)");
                // break;
            case F2D: // 141
                throw new VMUnsupportedOperationException("F2D(141)");
                // break;
            case D2I: // 142
                throw new VMUnsupportedOperationException("D2I(142)");
                // break;
            case D2L: // 143
                throw new VMUnsupportedOperationException("D2L(143)");
                // break;
            case D2F: // 144
                throw new VMUnsupportedOperationException("D2F(144)");
                // break;
            case I2B: // 145
                throw new VMUnsupportedOperationException("I2B(145)");
                // break;
            case I2C: // 146
                throw new VMUnsupportedOperationException("I2C(146)");
                // break;
            case I2S: // 147
                throw new VMUnsupportedOperationException("I2S(147)");
                // break;
            case LCMP: // 148
                throw new VMUnsupportedOperationException("LCMP(148)");
                // break;
            case FCMPL: // 149
                throw new VMUnsupportedOperationException("FCMPL(149)");
                // break;
            case FCMPG: // 150
                throw new VMUnsupportedOperationException("FCMPG(150)");
                // break;
            case DCMPL: // 151
                throw new VMUnsupportedOperationException("DCMPL(151)");
                // break;
            case DCMPG: // 152
                throw new VMUnsupportedOperationException("DCMPG(152)");
                // break;
            case IFEQ: // 153
                throw new VMUnsupportedOperationException("IFEQ(153)");
                // break;
            case IFNE: // 154
                throw new VMUnsupportedOperationException("IFNE(154)");
                // break;
            case IFLT: // 155
                throw new VMUnsupportedOperationException("IFLT(155)");
                // break;
            case IFGE: // 156
                throw new VMUnsupportedOperationException("IFGE(156)");
                // break;
            case IFGT: // 157
                throw new VMUnsupportedOperationException("IFGT(157)");
                // break;
            case IFLE: // 158
                throw new VMUnsupportedOperationException("IFLE(158)");
                // break;
            case IF_ICMPEQ: // 159
                throw new VMUnsupportedOperationException("IF_ICMPEQ(159)");
                // break;
            case IF_ICMPNE: // 160
                throw new VMUnsupportedOperationException("IF_ICMPNE(160)");
                // break;
            case IF_ICMPLT: // 161
                throw new VMUnsupportedOperationException("IF_ICMPLT(161)");
                // break;
            case IF_ICMPGE: // 162
                throw new VMUnsupportedOperationException("IF_ICMPGE(162)");
                // break;
            case IF_ICMPGT: // 163
                throw new VMUnsupportedOperationException("IF_ICMPGT(163)");
                // break;
            case IF_ICMPLE: // 164
                throw new VMUnsupportedOperationException("IF_ICMPLE(164)");
                // break;
            case IF_ACMPEQ: // 165
                throw new VMUnsupportedOperationException("IF_ACMPEQ(165)");
                // break;
            case IF_ACMPNE: // 166
                throw new VMUnsupportedOperationException("IF_ACMPNE(166)");
                // break;
            case GOTO: // 167
                throw new VMUnsupportedOperationException("GOTO(167)");
                // break;
            case JSR: // 168
                throw new VMUnsupportedOperationException("JSR(168)");
                // break;
            case RET: // 169
                throw new VMUnsupportedOperationException("RET(169)");
                // break;
            case TABLESWITCH: // 170
                throw new VMUnsupportedOperationException("TABLESWITCH(170)");
                // break;
            case LOOKUPSWITCH: // 171
                throw new VMUnsupportedOperationException("LOOKUPSWITCH(171)");
                // break;
            case IRETURN: // 172
                throw new VMUnsupportedOperationException("IRETURN(172)");
                // break;
            case LRETURN: // 173
                throw new VMUnsupportedOperationException("LRETURN(173)");
                // break;
            case FRETURN: // 174
                throw new VMUnsupportedOperationException("FRETURN(174)");
                // break;
            case DRETURN: // 175
                throw new VMUnsupportedOperationException("DRETURN(175)");
                // break;
            case ARETURN: // 176
                throw new VMUnsupportedOperationException("ARETURN(176)");
                // break;
            case RETURN: // 177
                throw new VMUnsupportedOperationException("RETURN(177)");
                // break;
            case GETSTATIC: // 178
                throw new VMUnsupportedOperationException("GETSTATIC(178)");
                // break;
            case PUTSTATIC: // 179
                throw new VMUnsupportedOperationException("PUTSTATIC(179)");
                // break;
            case GETFIELD: // 180
                throw new VMUnsupportedOperationException("GETFIELD(180)");
                // break;
            case PUTFIELD: // 181
                throw new VMUnsupportedOperationException("PUTFIELD(181)");
                // break;
            case INVOKEVIRTUAL: // 182
                throw new VMUnsupportedOperationException("INVOKEVIRTUAL(182)");
                // break;
            case INVOKESPECIAL: // 183
                throw new VMUnsupportedOperationException("INVOKESPECIAL(183)");
                // break;
            case INVOKESTATIC: // 184
                throw new VMUnsupportedOperationException("INVOKESTATIC(184)");
                // break;
            case INVOKEINTERFACE: // 185
                throw new VMUnsupportedOperationException("INVOKEINTERFACE(185)");
                // break;
            case INVOKEDYNAMIC: // 186
                throw new VMUnsupportedOperationException("INVOKEDYNAMIC(186)");
                // break;
            case NEW: // 187
                throw new VMUnsupportedOperationException("NEW(187)");
                // break;
            case NEWARRAY: // 188
                throw new VMUnsupportedOperationException("NEWARRAY(188)");
                // break;
            case ANEWARRAY: // 189
                throw new VMUnsupportedOperationException("ANEWARRAY(189)");
                // break;
            case ARRAYLENGTH: // 190
                throw new VMUnsupportedOperationException("ARRAYLENGTH(190)");
                // break;
            case ATHROW: // 191
                throw new VMUnsupportedOperationException("ATHROW(191)");
                // break;
            case CHECKCAST: // 192
                throw new VMUnsupportedOperationException("CHECKCAST(192)");
                // break;
            case INSTANCEOF: // 193
                throw new VMUnsupportedOperationException("INSTANCEOF(193)");
                // break;
            case MONITORENTER: // 194
                throw new VMUnsupportedOperationException("MONITORENTER(194)");
                // break;
            case MONITOREXIT: // 195
                throw new VMUnsupportedOperationException("MONITOREXIT(195)");
                // break;
            case WIDE: // 196
                throw new VMUnsupportedOperationException("WIDE(196)");
                // break;
            case MULTIANEWARRAY: // 197
                throw new VMUnsupportedOperationException("MULTIANEWARRAY(197)");
                // break;
            case IFNULL: // 198
                throw new VMUnsupportedOperationException("IFNULL(198)");
                // break;
            case IFNONNULL: // 199
                throw new VMUnsupportedOperationException("IFNONNULL(199)");
                // break;
            case GOTO_W: // 200
                throw new VMUnsupportedOperationException("GOTO_W(200)");
                // break;
            case JSR_W: // 201
                throw new VMUnsupportedOperationException("JSR_W(201)");
                // break;
        }
    }
}
