
interface Point {
    x: number
    y: number
}

function lerp(a: Point, b: Point, t: number): Point {
    const x = a.x + (b.x - a.x) * t
    const y = a.y + (b.y - a.y) * t
    return { x, y }
}

function add(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

function sub(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

function mul(a: Point, s: number): Point {
    return {
        x: a.x * s,
        y: a.y * s
    }
}

function cross(pt1: Point, pt2: Point): number {
    return pt1.x * pt2.y - pt1.y * pt2.x
}

function rotate(pt: Point, c: Point, rad: number): Point {
    const x = c.x + Math.cos(rad) * (pt.x - c.x) - Math.sin(rad) * (pt.y - c.y)
    const y = c.y + Math.sin(rad) * (pt.x - c.x) + Math.cos(rad) * (pt.y - c.y)
    return { x, y }
}

function approxEqual(a: number, b: number): boolean {
    return Math.abs(a - b) < 1e-3
}

function ptEqual(a: Point, b: Point): boolean {
    return distance(a, b) < 0.1
}

function distance(a: Point, b: Point): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
}

function dot(pt1: Point, pt2: Point): number {
    return pt1.x * pt2.x + pt1.y * pt2.y
}

export { Point, lerp, add, sub, mul, cross, dot, rotate, ptEqual, approxEqual, distance }