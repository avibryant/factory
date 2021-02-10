import { Point, sub, cross, lerp, rotate, ptEqual, dot, distance } from './point'

interface Line {
    type: "line"
    p1: Point
    p2: Point
}

function line(p1: Point, p2: Point): Line {
    return { type: "line", p1, p2 }
}

function slope(l: Line): number {
    return (l.p2.y - l.p1.y) / (l.p2.x - l.p1.x)
}

function perpAt(p1: Point, p2: Point): Line {
    const p3 = rotate(p2, p1, Math.PI / 2)
    return line(p1, p3)
}


function intersection(
    l1: Line,
    l2: Line
): Point {
    let av = sub(l1.p2, l1.p1)
    let bv = sub(l2.p2, l2.p1)
    let d = cross(av, bv)

    if (Math.abs(d) <= 1e-6) {
        return collinearIntersection(l1, l2)
    }

    let asb = sub(l1.p1, l2.p1)
    let s = cross(bv, asb) / d
    return lerp(l1.p1, l1.p2, s)
}

function nearestPoint(l: Line, pt: Point): number {
    let bSa = sub(l.p2, l.p1)
    let pSa = sub(pt, l.p1)
    return dot(bSa, pSa) / dot(bSa, bSa)
}

function collinearIntersection(
    l1: Line,
    l2: Line
): Point {
    for (let i = 0; i < 2; i++) {
        let tp = lerp(l1.p1, l1.p2, i)
        let tb = nearestPoint(l2, tp)
        if (tb <= 0) {
            let s = nearestPoint(l1, l2.p1)
            if (s >= 0 && s <= 1) {
                if (ptEqual(lerp(l1.p1, l1.p2, s), l2.p1))
                    return l2.p1
                else {
                    return null
                }
            }
        } else if (tb >= 1) {
            let s = nearestPoint(l1, l2.p2)
            if (s >= 0 && s <= 1)
                if (ptEqual(lerp(l1.p1, l1.p2, s), l2.p2))
                    return l2.p2
                else return null
        } else {
            if (ptEqual(tp, lerp(l2.p1, l2.p2, tb)))
                return tp
            else {
                return null
            }
        }
    }
}

export { Line, line, slope, intersection, perpAt }

