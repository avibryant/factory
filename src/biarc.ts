import { Point } from './point'
import { Cubic } from './cubic'

interface BiArc {
    p1: Point
    p2: Point
    p3: Point
    r1: number
    r2: number
}

function cubicBiArc(c: Cubic): BiArc {
    return null
}

function maxDistance(c: Cubic, biArc: BiArc): number {
    return 0
}

export { BiArc, cubicBiArc, maxDistance }

