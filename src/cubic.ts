import { Point, terp } from './point'

interface Cubic {
    p1: Point
    p2: Point
    c1: Point
    c2: Point
}

function cubic(p1: Point, p2: Point, c1: Point, c2: Point): Cubic {
    return { p1, p2, c1, c2 }
}

function inflexion(c: Cubic): number[] {
    const results = []

    return results
}
/*
        /// <summary>
        /// Inflexion points of the Bezier curve. They only valid if they are real and in the range of [0,1]
        /// </summary>
        /// <param name="bezier"></param>
        /// <returns></returns>
        public Tuple < Complex, Complex > InflexionPoints
{
    get
    {
        // http://www.caffeineowl.com/graphics/2d/vectorial/cubic-inflexion.html

        var A = C1 - P1
        var B = C2 - C1 - A
        var C = P2 - C2 - A - 2 * B

        var a = new Complex(B.X * C.Y - B.Y * C.X, 0)
        var b = new Complex(A.X * C.Y - A.Y * C.X, 0)
        var c = new Complex(A.X * B.Y - A.Y * B.X, 0)

        var t1 = (-b + Complex.Sqrt(b * b - 4 * a * c)) / (2 * a)
        var t2 = (-b - Complex.Sqrt(b * b - 4 * a * c)) / (2 * a)

        return Tuple.Create(t1, t2)
    }
}
*/

function split(c: Cubic, t: number): [Cubic, Cubic] {
    const p0 = terp(this.p1, this.c1, t)
    const p1 = terp(this.c1, this.c2, t)
    const p2 = terp(this.c2, this.p2, t)
    const p01 = terp(p0, p1, t)
    const p12 = terp(p1, p2, t)
    const dp = terp(p01, p12, t)

    return [
        { p1: this.p1, c1: p0, c2: p01, p2: dp },
        { p1: dp, c1: p12, c2: p2, p2: this.p2 }
    ]
}

export { cubic, split, Cubic }