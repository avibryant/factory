import { Cubic, split, splitAtInflections } from './cubic'
import { Point } from './point'
import { BiArc, cubicBiArc, maxDistance } from './biarc'

interface Arc {
    p1: Point
    p2: Point
    r: number
}

function findCubicArcs(c: Cubic, tolerance: number): Arc[] {
    const biArc = cubicBiArc(c)
    if (maxDistance(c, biArc) < tolerance) {
        return [
            { p1: biArc.p1, p2: biArc.p2, r: biArc.r1 },
            { p1: biArc.p2, p2: biArc.p3, r: biArc.r2 }
        ]
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

export { Arc, cubicArcs }