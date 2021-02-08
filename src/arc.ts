import { Cubic, cubicFn, split, splitAtInflections } from './cubic'
import { Point, distance, sub } from './point'
import { cubicBiArc, centers } from './biarc'

interface Arc {
    p1: Point
    p2: Point
    center: Point
}

function radius(a: Arc): number {
    return distance(a.p1, a.center)
}

function startAngle(a: Arc): number {
    const v = sub(a.p1, a.center)
    return Math.atan2(v.y, v.x)
}

function endAngle(a: Arc): number {
    const v = sub(a.p2, a.center)
    return Math.atan2(v.y, v.x)
}

function sweepAngle(a: Arc): number {
    return endAngle(a) - startAngle(a)
}

function length(a: Arc): number {
    return radius(a) * Math.abs(sweepAngle(a))
}

function arcFn(a: Arc, t: number): Point {
    const r = radius(a)
    const an0 = startAngle(a)
    const an1 = sweepAngle(a)
    const x = a.center.x + r * Math.cos(an0 + t * an1)
    const y = a.center.y + r * Math.sin(an0 + t * an1)
    return { x, y }
}

const eps = 0.01
function maxDistance(c: Cubic, a1: Arc, a2: Arc): number {
    let max = 0
    let t = 0
    let s = length(a1) / (length(a1) + length(a2))
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
    const arcs = [
        { p1: biArc.p1, p2: biArc.px, center: cs[0] },
        { p1: biArc.px, p2: biArc.p2, center: cs[1] }
    ]
    if (maxDistance(c, arcs[0], arcs[1]) < tolerance) {
        return arcs
    } else {
        console.log("split and recurse")
        const [left, right] = split(c, 0.5)
        const leftArcs = findCubicArcs(left, tolerance)
        const rightArcs = findCubicArcs(right, tolerance)
        return leftArcs.concat(rightArcs)
    }
}

function cubicArcs(c: Cubic, tolerance: number): Arc[] {
    console.log("new cubic")
    return splitAtInflections(c).flatMap((cc) => {
        console.log("inflection")
        return findCubicArcs(cc, tolerance)
    })
}

export { Arc, cubicArcs }