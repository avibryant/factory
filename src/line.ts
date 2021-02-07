import { Point, sub, cross, lerp, rotate } from './point'

interface Line {
    p1: Point
    p2: Point
}

function line(p1: Point, p2: Point): Line {
    return { p1, p2 }
}

function slope(l: Line): number {
    return (l.p2.y - l.p1.y) / (l.p2.x - l.p1.x)
}

function perpAt(p1: Point, p2: Point): Line {
    const p3 = rotate(p2, p1, Math.PI / 2)
    return { p1: p1, p2: p3 }
}


function intersection(
    l1: Line,
    l2: Line
): Point {
    let av = sub(l1.p2, l1.p1)
    let bv = sub(l2.p2, l2.p1)
    let d = cross(av, bv)

    if (Math.abs(d) <= 1e-6) {
        //todo
        console.log("collinear")
        return null
    }

    let asb = sub(l1.p1, l2.p1)
    let s = cross(bv, asb) / d
    return lerp(l1.p1, l1.p2, s)
}

export { Line, line, slope, intersection, perpAt }

