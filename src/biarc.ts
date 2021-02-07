import { Point, ptEqual, approxEqual, mul, add, distance } from './point'
import { Cubic } from './cubic'
import { Line, line, slope, intersection, perpAt } from './line'

interface BiArc {
    p1: Point
    p2: Point
    t1: Line
    t2: Line
    px: Point
}

function cubicBiArc(c: Cubic): BiArc {
    console.log(c)
    const c1 = ptEqual(c.p1, c.c1) ? c.c2 : c.c1
    const c2 = ptEqual(c.p2, c.c2) ? c.c1 : c.c2

    const t1 = line(c.p1, c1)
    const t2 = line(c.p2, c2)

    if (approxEqual(slope(t1), slope(t2))) {
        return null //todo
    }

    const v = intersection(t1, t2)

    const dP1V = distance(c.p1, v)
    const dP2V = distance(c.p2, v)
    const dP1P2 = distance(c.p1, c.p2)
    const p1d = mul(c.p1, dP2V)
    const p2d = mul(c.p2, dP1V)
    const vd = mul(v, dP1P2)
    const gd = add(add(p1d, p2d), vd)
    const g = mul(gd, 1.0 / (dP2V + dP1V + dP1P2))

    return {
        p1: c.p1,
        p2: c.p2,
        px: g,
        t1: t1,
        t2: t2
    }
}

function maxDistance(c: Cubic, biArc: BiArc): number {
    return 0
}

function center(p0: Point, px: Point, t: Line): Point {
    const mid = mul(add(p0, px), 0.5)
    const perp = perpAt(mid, px)
    return intersection(perp, t)
}

function centers(biArc: BiArc): [Point, Point] {
    return [
        center(biArc.p1, biArc.px, biArc.t1),
        center(biArc.p2, biArc.px, biArc.t2)
    ]
}

export { BiArc, cubicBiArc, maxDistance, centers }

