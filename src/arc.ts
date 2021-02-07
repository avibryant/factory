import { Cubic, split, splitAtInflections } from './cubic'
import { Point } from './point'
import { cubicBiArc, maxDistance, centers } from './biarc'

interface Arc {
    p1: Point
    p2: Point
    center: Point
}

function findCubicArcs(c: Cubic, tolerance: number): Arc[] {
    const biArc = cubicBiArc(c)
    if (maxDistance(c, biArc) < tolerance) {
        const cs = centers(biArc)
        return [
            { p1: biArc.p1, p2: biArc.px, center: cs[0] },
            { p1: biArc.px, p2: biArc.p2, center: cs[1] }
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