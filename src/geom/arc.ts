import { Point, distance, sub } from './point'

interface Arc {
    p1: Point
    p2: Point
    center: Point
    cw: boolean
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
    const sw = endAngle(a) - startAngle(a)
    if (a.cw && sw < 0) return 2 * Math.PI + sw
    if (!a.cw && sw > 0) return sw - 2 * Math.PI
    return sw
}

function arcLength(a: Arc): number {
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

export { Arc, arcLength, arcFn }