
interface Point {
    x: number
    y: number
}

function terp(a: Point, b: Point, t: number): Point {
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

function mul(a: Point, b: Point): Point {
    return {
        x: a.x * b.x,
        y: a.y * b.y
    }
}
export { Point, terp, add, sub, mul }