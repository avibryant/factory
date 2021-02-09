import { Point, lerp, sub, mul, add } from '../geom/point'

interface Cubic {
    p1: Point
    p2: Point
    c1: Point
    c2: Point
}

function cubic(p1: Point, p2: Point, c1: Point, c2: Point): Cubic {
    return { p1, p2, c1, c2 }
}

function cubicFn(c: Cubic, t: number): Point {
    if (t == 0) {
        return c.p1
    } else if (t == 1) {
        return c.p2
    }

    const mt = 1 - t
    const mt2 = mt * mt
    const t2 = t * t

    // (1 - t)^3 * p1 + 3t(1 - t)^2 * c1 + 3(1 - t)t^2 * c2 + t^3 * p2
    const a1 = mul(c.p1, mt2 * mt)
    const a2 = mul(c.c1, 3 * mt2 * t)
    const a3 = mul(c.c2, 3 * mt * t2)
    const a4 = mul(c.p2, t2 * t)

    return add(a1, add(a2, add(a3, a4)))
}

function transform(c: Cubic, fn: (pt: Point) => Point) {
    return {
        p1: fn(c.p1),
        p2: fn(c.p2),
        c1: fn(c.c1),
        c2: fn(c.c2)
    }
}

function align(c: Cubic): Cubic {
    const translated = transform(c, (pt) => {
        return sub(pt, c.p1)
    })

    const a = Math.atan2(translated.p2.y, translated.p2.x)
    return transform(translated, (pt) => {
        return {
            x: pt.x * Math.cos(-a) - pt.y * Math.sin(-a),
            y: pt.x * Math.sin(-a) + pt.y * Math.cos(-a)
        }
    })
}

function nearZero(x: number): boolean {
    return Math.abs(x) < 1e-5
}

function inflections(cu: Cubic): number[] {
    const ca = align(cu)

    const a = ca.c2.x * ca.c1.y
    const b = ca.p2.x * ca.c1.y
    const c = ca.c1.x * ca.c2.y
    const d = ca.p2.x * ca.c2.y

    const x = -3 * a + 2 * b + 3 * c - d
    const y = 3 * a - b - 3 * c
    const z = c - a

    const roots = []

    if (nearZero(x)) {
        if (!nearZero(y)) {
            roots.push(-z / y)
        }
    }

    else {
        const det = y * y - 4 * x * z
        if (det > 0) {
            const sq = Math.sqrt(det)
            const d2 = 2 * x

            if (!nearZero(d2)) {
                roots.push(-(y + sq) / d2)
                roots.push((sq - y) / d2)
            }
        }
    }

    return roots
        .filter(i => i > 0 && i < 1)
        .sort((a, b) => a - b)
}

function split(c: Cubic, t: number): [Cubic, Cubic] {
    const p0 = lerp(c.p1, c.c1, t)
    const p1 = lerp(c.c1, c.c2, t)
    const p2 = lerp(c.c2, c.p2, t)
    const p01 = lerp(p0, p1, t)
    const p12 = lerp(p1, p2, t)
    const dp = lerp(p01, p12, t)

    return [
        { p1: c.p1, c1: p0, c2: p01, p2: dp },
        { p1: dp, c1: p12, c2: p2, p2: c.p2 }
    ]
}

function splitAtInflections(c: Cubic): Cubic[] {
    const inflect = inflections(c)
    if (inflect.length == 0) {
        return [c]
    } else if (inflect.length == 1) {
        return split(c, inflect[0])
    } else {
        const t1 = inflect[0]
        const t2 = inflect[1]
        const [left, rest] = split(c, t1)
        const t3 = (1 - t1) * t2
        const [center, right] = split(rest, t3)
        return [left, center, right]
    }
}

export { cubic, cubicFn, split, inflections, splitAtInflections, Cubic }