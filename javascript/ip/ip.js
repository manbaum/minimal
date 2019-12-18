"use strict";

// 将一组数组合并单个数组。
// 如 arrayConcat([[1, 2, 3], [4, 5], [6], [7, 8, 9]])
// 结果为 [1, 2, 3, 4, 5, 6, 7, 8, 9]
const arrayConcat = arrayOfArraies =>
    Array.prototype.concat.apply([], arrayOfArraies);

// 将任意数值 value 转成 min 到 max 之间的整数。
// 非数值返回 0；有小数的截掉小数部分仅取整数；大于最大值的取最大值；小于最小值的取最小值。
const intClamp = (min, max) =>
    value => {
        const number = Number(value);
        if (isNaN(number) || number === 0) {
            return 0;
        } else {
            return Math.min(Math.max(Math.trunc(number), min), max);
        }
    };

// 将任意数值转成 -0x1fffffffffffff 到 0x1fffffffffffff 之间的安全整数。
// 非数值返回 0；有小数的截掉小数部分仅取整数；大于最大值的取最大值；小于最小值的取最小值。
// 如 toInt53([]) 结果为 0
// 如 toInt53(9e15) 结果为 9007199254740991
// 如 toInt53(-Infinity) 结果为 -9007199254740991
// 如 toInt53(9e14) 结果为 900000000000000
// 如 toInt53(-9e14) 结果为 -900000000000000
// 如 toInt53(Math.PI * 1e10) 结果为 31415926535
const toInt53 = intClamp(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

// 将任意数值转成 0 到 0xffffffff 之间的 32-bit 无符号整数。
// 非数值返回 0；无穷大返回 0；有小数的截断小数；负数取 2 的补码。
// 如 toUint32([]) 结果为 0
// 如 toUint32(Infintity) 结果为 0
// 如 toUint32(0x1ffffffff) 结果为 4294967295
// 如 toUint32(Math.PI * 1e9) 结果为 3141592653
// 如 toUint32(-Math.PI * 1e9) 结果为 1153374643
const toUint32 = value => value >>> 0;

// 将任意数值转成 0 到 32 之间的整数。
// 非数值返回 0；有小数的截掉小数部分仅取整数；大于最大值的取最大值；小于最小值的取最小值。
// 如 toCidrInt([]) 结果为 0
// 如 toCidrInt(Infintity) 结果为 32
// 如 toCidrInt(-0x1ffffffff) 结果为 0
// 如 toCidrInt(Math.PI * 10) 结果为 31
const toCidrInt = intClamp(0, 32);

// 计算以 2 为底的对数，取结果整数部分。
// 检验 Array.from({ length: 1000 }).every((_, i) => intLog2(2 ** i) == i) 结果为 true
const intLog2 = value => Math.trunc(Math.log(value) / Math.log(2));

// 将 IP 地址字符串转换为 32-bit 无符号整数。
// 若 IP 格式非法将抛异常。
// 如 parseIpString("0.0.0.0") 结果为 0
// 如 parseIpString("255.255.255.255") 结果为 4294967295
// 如 parseIpString("192.168.1.1") 结果为 3232235777
const parseIpString = ipStr => {
    if (
        /^(\d|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))(\.(\d|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))){3}$/.test(
            ipStr
        )
    ) {
        return ipStr.split(".").reduce((m, d) => m << 8 | parseInt(d), 0) >>> 0;
    } else {
        throw Object.assign(new Error("bad.ip.format"), {
            input: ipStr
        });
    }
};

// 将 32-bit 无符号整数转换为 IP 地址字符串。
// 如 toIpString(0) 结果为 '0.0.0.0'
// 如 toIpString(4294967295) 结果为 '255.255.255.255'
// 如 toIpString(3232235777) 结果为 '192.168.1.1'
const toIpString = ip =>
    [ip >>> 24 & 0xff, ip >>> 16 & 0xff, ip >>> 8 & 0xff, ip >>> 0 & 0xff].join(
        "."
    );

// 根据 CIDR 数给出对应的子网掩码。
// cidr 必须在 0-32 之间。
// 如 netmaskFromValidCidr(32) 结果为 4294967295
// 如 netmaskFromValidCidr(31) 结果为 4294967294
// 如 netmaskFromValidCidr(30) 结果为 4294967292
// 如 netmaskFromValidCidr(24) 结果为 4294967040
// 如 netmaskFromValidCidr(16) 结果为 4294901760
// 如 netmaskFromValidCidr(8) 结果为 4278190080
// 如 netmaskFromValidCidr(0) 结果为 0
const netmaskFromValidCidr = cidr => 2 ** cidr - 1 << 32 - cidr >>> 0;

// 根据 CIDR 数给出对应的子网掩码。
// cidr 会首先被强制截断到 0-32 之间。
// 如 netmaskFromCidr(33) 结果为 4294967295
// 如 netmaskFromCidr(32) 结果为 4294967295
// 如 netmaskFromCidr(31) 结果为 4294967294
// 如 netmaskFromCidr(30) 结果为 4294967292
// 如 netmaskFromCidr(24) 结果为 4294967040
// 如 netmaskFromCidr(16) 结果为 4294901760
// 如 netmaskFromCidr(8) 结果为 4278190080
// 如 netmaskFromCidr(0) 结果为 0
// 如 netmaskFromCidr(-3) 结果为 0
const netmaskFromCidr = cidr => netmaskFromValidCidr(toCidrInt(cidr));

// 根据子网掩码给出对应的 CIDR 数。
// netmask 必须是一个 32-bit 无符号整数，并且是合法的子网掩码。
const cidrFromValidNetmask = netmask =>
    32 - intLog2(((netmask ^ 0xffffffff) >>> 0) + 1);

// 根据子网掩码给出对应的 CIDR 数。
// netmask 会首先被强制截断成一个 32-bit 无符号整数。
const cidrFromNetmask = netmask => cidrFromValidNetmask(netmask >>> 0);

// 产生子网的描述信息。
// 包括：起止 IP 的数值、段内 IP 数量、起止 IP 的字符串形式、子网掩码数值及字符串形式、CIDR 格式中的数值。
// 如：rangeInfo([3232235776, 4294967292])
// 结果为：{ ipBegin:    3232235776,
//          ipEnd:      3232235779,
//          countOfIp:  4,
//          ipBeginStr: '192.168.1.0',
//          ipEndStr:   '192.168.1.3',
//          netMask:    4294967292,
//          netMaskStr: '255.255.255.252',
//          cidrNum:    30 }
const subnetInfo = ([ip, netmask]) => {
    const cidr = cidrFromNetmask(netmask),
        {
            ipBegin,
            ipEnd
        } = segmentFromCidr(ip, cidr);
    return {
        ipBegin,
        ipEnd,
        countOfIp: ipEnd - ipBegin + 1,
        ipBeginStr: toIpString(ipBegin),
        ipEndStr: toIpString(ipEnd),
        netmask,
        netmaskStr: toIpString(netmask),
        cidrNum: cidr
    };
};

// 给出 CIDR 对应的起止 IP。
// ip 会被强制截断为一个 32-bit 无符号整数。
// cidr 会被强制截断到 0-32 之间。
const segmentFromCidr = (ip, cidr) => {
    const validCidr = toCidrInt(cidr),
        netmask = netmaskFromValidCidr(validCidr),
        ipBegin = (ip & netmask) >>> 0,
        ipEnd = ipBegin + (2 ** (32 - validCidr) - 1);
    return {
        ipBegin,
        ipEnd
    };
};

// 给出子网对应的起止 IP。
const segmentFromSubnet = ([ip, netmask]) =>
    segmentFromCidr(ip, cidrFromNetmask(netmask));

// 给出 CIDR 对应的子网。
const subnetFromCidr = (ip, cidr) => {
    const netmask = netmaskFromCidr(cidr);
    return [(ip & netmask) >>> 0, netmask];
};

// 给出起止 IP 对应的子网列表。
// 因为起止 IP 可能跨多个子网，所以结果为列表。
// 如 subnetsFromSegment({ ipBegin: 3232235776, ipEnd: 3232235779 })
// 结果为 [[3232235776, 4294967292]]。
const subnetsFromSegment = segment => {
    const {
        ipBegin,
        ipEnd
    } = segment;
    const array = [];
    let ipCurrent = ipBegin;
    while (ipCurrent <= ipEnd) {
        let saveSubnet = null, ipNext = null;
        for (let cidr = 32; cidr >= 0; cidr--) {
            const {
                ipBegin: ipLow,
                ipEnd: ipHigh
            } = segmentFromCidr(ipCurrent, cidr);
            if (ipLow == ipCurrent && ipHigh <= ipEnd) {
                saveSubnet = [ipLow, netmaskFromValidCidr(cidr)];
                ipNext = ipHigh + 1;
            } else {
                break;
            }
        }
        if (saveSubnet != null) {
            array.push(saveSubnet);
            ipCurrent = ipNext;
        } else {
            break;
        }
    }
    return array;
};

// 给出一组起止 IP 对应的子网列表。不合并相邻或交错重叠的网段。
const subnetsFromSegments = segments =>
    arrayConcat(segments.map(subnetsFromSegment));

// 合并起止 IP 列表中相邻或交错重叠的的网段。
// 如 mergeAdjacentSegment([{ ipBegin: 3232235776, ipEnd: 3232235779 }, { ipBegin: 3232235778, ipEnd: 3232235783 }])
// 结果为 [{ ipBegin: 3232235776, ipEnd: 3232235783 }]
const mergeAdjacentSegments = segments => {
    const array = [];
    let saveSegment = null;
    segments.sort((s1, s2) => s1.ipBegin - s2.ipBegin).forEach(segment => {
        const {
            ipBegin,
            ipEnd
        } = segment;
        if (saveSegment == null) {
            saveSegment = {
                ipBegin,
                ipEnd
            };
        } else if (
            ipBegin >= saveSegment.ipBegin && ipBegin <= saveSegment.ipEnd + 1
        ) {
            saveSegment.ipEnd = Math.max(saveSegment.ipEnd, ipEnd);
        } else {
            array.push(saveSegment);
            saveSegment = {
                ipBegin,
                ipEnd
            };
        }
    });
    if (saveSegment != null) {
        array.push(saveSegment);
    }
    return array;
};

// 合并子网列表中相邻或交错重叠的网段。
// 先将子网列表转换成起止 IP 列表，然后合并起止 IP 列表中的相邻网段，然后将起止 IP 列表转回子网列表。
const mergeAdjacentSubnets = subnets =>
    arrayConcat(
        mergeAdjacentSegments(subnets.map(segmentFromSubnet)).map(
            subnetsFromSegment
        )
    );

// 将子网列表转换成 CIDR 形式的网段定义字符串。
// 如：toCidrString([[3232235776, 4294967292], [3232235780, 4294967292], [3232239620, 4294967295]])
// 结果为："192.168.1.0/29;192.168.16.4"
const toCidrString = subnets => {
    return subnets
        .map(a => {
            const cidr = cidrFromNetmask(a[1]);
            if (cidr == 32) {
                return toIpString(a[0]);
            } else {
                return toIpString(a[0]) + "/" + cidr;
            }
        })
        .join("; ");
};

// 将子网列表转换成子网形式的网段定义字符串。
// 如：toSubnetString([[3232235776, 4294967292], [3232235780, 4294967292], [3232239620, 4294967295]])
// 结果为："192.168.1.0/255.255.255.248;192.168.16.4"
const toSubnetString = subnets => {
    return subnets
        .map(a => {
            if (a[1] >>> 0 == 0xffffffff) {
                return toIpString(a[0]);
            } else {
                return toIpString(a[0]) + "/" + toIpString(a[1]);
            }
        })
        .join("; ");
};

// 将子网列表转换成起止 IP 形式的网段定义字符串。自动合并相邻网段。
// 如：toRangeString([[3232235776, 4294967292], [3232235780, 4294967292], [3232239620, 4294967295]])
// 结果为："192.168.1.0-192.168.1.7;192.168.16.4"
const toSegmentString = subnets => {
    return mergeAdjacentSegments(subnets.map(segmentFromSubnet))
        .map(s => {
            if (s.ipBegin == s.ipEnd) {
                return toIpString(s.ipBegin);
            } else {
                return toIpString(s.ipBegin) + "-" + toIpString(s.ipEnd);
            }
        })
        .join("; ");
};

// 定义一组 IP 范围格式定义及其相应解析器。解析器将 IP 范围字符串统一表示为起止 IP 形式。
const Parsers = [
    // 单个 IP 字符串形式。可识别形如 xxx.xxx.xxx.xxx 的定义。
    Object.defineProperty(
        s => {
            const ipBegin = parseIpString(s), ipEnd = ipBegin;
            return {
                ipBegin,
                ipEnd
            };
        },
        "regExp",
        {
            value: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/
        }
    ),

    // CIDR 形式。可识别形如 xxx.xxx.xxx.xxx/yy 的定义，其中 yy 为 0-32 的整数。
    Object.defineProperty(
        s => {
            const p = s.split(/\s*\/\s*/);
            return segmentFromCidr(parseIpString(p[0]), parseInt(p[1]));
        },
        "regExp",
        {
            value: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}\s*\/\s*(\d|[12]\d|3[012])$/
        }
    ),

    // 子网形式。可识别形如 xxx.xxx.xxx.xxx/yyy.yyy.yyy.yyy 的定义，其中 yyy.yyy.yyy.yyy 必须是合法的子网掩码。
    Object.defineProperty(
        s => {
            const p = s.split(/\s*\/\s*/).map(parseIpString),
                cidr = cidrFromNetmask(p[1]);
            if (p[1] != netmaskFromValidCidr(cidr)) {
                throw Object.assign(new Error("bad.ip.subnet.format"), {
                    input: s
                });
            }
            return segmentFromCidr(p[0], cidr);
        },
        "regExp",
        {
            value: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}\s*\/\s*(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/
        }
    ),

    // 起止 IP 形式。可识别形如 xxx.xxx.xxx.xxx-yyy.yyy.yyy.yyy 的定义，其中截止 IP 不能比起始 IP 小。
    Object.defineProperty(
        s => {
            const [ipBegin, ipEnd] = s.split(/\s*-\s*/).map(parseIpString);
            if (ipEnd < ipBegin) {
                throw Object.assign(new Error("bad.ip.range.format"), {
                    input: s
                });
            }
            return {
                ipBegin,
                ipEnd
            };
        },
        "regExp",
        {
            value: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}\s*-\s*(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/
        }
    )
];

// 解析包含上述四种格式 IP 段定义的字符串，多个 IP 段之间用逗号或分号分隔。分隔符前后允许有空格。错误 IP 段格式抛异常。
// 如：parseRangeString("192.168.16.4, 192.168.17.0/24, 192.168.19.4/255.255.255.252, 10.0.0.1-10.0.0.11")
// 结果为：[[3232239620, 4294967295], [3232239872, 4294967040], [3232240388, 4294967292],
//         [167772161,  4294967295], [167772162,  4294967294], [167772164,  4294967292],  [167772168, 4294967292]]
const parseRangeString = (rangeStr, mergeAdjacent = true) => {
    const segments = rangeStr.split(/\s*[,;]\s*/).map(s => {
        const parse = Parsers.find(p => p.regExp.test(s));
        if (parse == null) {
            throw Object.assign(new Error("bad.ip.range.format"), {
                input: s
            });
        } else {
            return parse(s);
        }
    });
    return subnetsFromSegments(
        mergeAdjacent ? mergeAdjacentSegments(segments) : segments
    );
};

// 给定一个 IP 段定义，以及一个 IP，判断 IP 是否在 IP 段中。函数使用柯里化形式，便于复用 IP 段定义。
// 如 checkIP = isInRange("192.168.16.4, 192.168.17.0/24, 192.168.19.4/255.255.255.252, 10.0.0.1-10.0.0.11")
// 则 checkIP("192.168.17.8") 结果为 true。
const isInRange = rangeStr => {
    const subnets = parseRangeString(rangeStr, true);
    return Object.defineProperty(
        ipStr => {
            const ip = parseIpString(ipStr);
            let low = 0, high = subnets.length;
            if (low == high) return false;
            if (ip < subnets[low][0]) return false;
            while (true) {
                if (low + 1 >= high || ip < subnets[low + 1][0]) {
                    break;
                } else if (ip >= subnets[high - 1][0]) {
                    low = high - 1;
                    break;
                }
                const mid = Math.floor((low + high) / 2);
                if (ip >= subnets[mid][0]) {
                    low = mid;
                } else {
                    high = mid + 1;
                }
            }
            return subnets[low][0] == (ip & subnets[low][1]) >>> 0;
        },
        "subnets",
        {
            value: subnets
        }
    );
};

module.exports = {
    toUint32,
    toCidrInt,
    parseIpString,
    toIpString,
    netmaskFromCidr,
    cidrFromNetmask,
    subnetInfo,
    segmentFromCidr,
    segmentFromSubnet,
    subnetFromCidr,
    subnetsFromSegment,
    subnetsFromSegments,
    mergeAdjacentSegments,
    mergeAdjacentSubnets,
    toCidrString,
    toSubnetString,
    toSegmentString,
    parseRangeString,
    isInRange
};
