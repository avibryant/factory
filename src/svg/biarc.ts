import { Point, ptEqual, approxEqual, mul, add, distance } from '../geom/point'
import { Line, line, slope, intersection, perpAt } from '../geom/line'
import { Arc, arcFn, arcLength } from '../geom/arc'
import { Cubic, cubicFn, split, splitAtInflections } from './cubic'

interface BiArc {
    p1: Point
    p2: Point
    t1: Line
    t2: Line
    px: Point
}

function cubicBiArc(c: Cubic): BiArc {
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

function center(p0: Point, px: Point, t: Line): Point {
    const mid = mul(add(p0, px), 0.5)
    const perpMid = perpAt(mid, px)
    const perpStart = perpAt(p0, t.p2)
    return intersection(perpStart, perpMid)
}

function centers(biArc: BiArc): [Point, Point] {
    return [
        center(biArc.p1, biArc.px, biArc.t1),
        center(biArc.p2, biArc.px, biArc.t2)
    ]
}

function clockwise(biArc: BiArc): boolean {
    const a1 = (biArc.px.x - biArc.p1.x) * (biArc.px.y + biArc.p1.y)
    const a2 = (biArc.p2.x - biArc.px.x) * (biArc.p2.y + biArc.px.y)
    const a3 = (biArc.p1.x - biArc.p2.x) * (biArc.p1.y + biArc.p2.y)
    return (a1 + a2 + a3) < 0
}


const eps = 0.01
function maxDistance(c: Cubic, a1: Arc, a2: Arc): number {
    let max = 0
    let t = 0
    let s = arcLength(a1) / (arcLength(a1) + arcLength(a2))
    while (t < s) {
        const p1 = arcFn(a1, t)
        const p2 = cubicFn(c, t)
        const d = distance(p1, p2)
        if (d > max)
            max = d
        t += eps
    }

    while (t < 1) {
        const p1 = arcFn(a2, t - s)
        const p2 = cubicFn(c, t)
        const d = distance(p1, p2)
        if (d > max)
            max = d
        t += eps
    }

    return max
}

function findCubicArcs(c: Cubic, tolerance: number): Arc[] {
    const biArc = cubicBiArc(c)
    const cs = centers(biArc)
    const cw = clockwise(biArc)
    const arcs = [
        { p1: biArc.p1, p2: biArc.px, center: cs[0], cw },
        { p1: biArc.px, p2: biArc.p2, center: cs[1], cw }
    ]
    if (maxDistance(c, arcs[0], arcs[1]) < tolerance) {
        return arcs
    } else {
        const [left, right] = split(c, 0.5)
        const leftArcs = findCubicArcs(left, tolerance)
        const rightArcs = findCubicArcs(right, tolerance)
        return leftArcs.concat(rightArcs)
    }
}

function cubicArcs(c: Cubic, tolerance: number): Arc[] {
    return splitAtInflections(c).flatMap((cc) => {
        return findCubicArcs(cc, tolerance)
    })
}

export { cubicArcs }

