import { Point, lerp, sub, mul, add } from './point'

interface Cubic {
    p1: Point
    p2: Point
    c1: Point
    c2: Point
}

function cubic(p1: Point, p2: Point, c1: Point, c2: Point): Cubic {
    return { p1, p2, c1, c2 }
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
        const sq = Math.sqrt(det)
        const d2 = 2 * x

        if (!nearZero(d2)) {
            roots.push(-(y + sq) / d2)
            roots.push((sq - y) / d2)
        }
    }

    return roots
}

function split(c: Cubic, t: number): [Cubic, Cubic] {
    const p0 = lerp(this.p1, this.c1, t)
    const p1 = lerp(this.c1, this.c2, t)
    const p2 = lerp(this.c2, this.p2, t)
    const p01 = lerp(p0, p1, t)
    const p12 = lerp(p1, p2, t)
    const dp = lerp(p01, p12, t)

    return [
        { p1: this.p1, c1: p0, c2: p01, p2: dp },
        { p1: dp, c1: p12, c2: p2, p2: this.p2 }
    ]
}

export { cubic, split, inflections, Cubic }