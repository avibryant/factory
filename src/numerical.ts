//Adapted from PaperJS by Jürg Lehni & Jonathan Puckey

const EPSILON = 1e-12
const MACHINE_EPSILON = 1.12e-16

function getNormalizationFactor(a: number, b: number, c: number): number {
    var norm = Math.max(a, b, c)
    return norm && (norm < 1e-8 || norm > 1e8)
        ? Math.pow(2, -Math.round(Math.log2(norm)))
        : 0
}

function split(v: number) {
    var x = v * 134217729,
        y = v - x,
        hi = y + x, // Don't optimize y away!
        lo = v - hi
    return [hi, lo]
}

function getDiscriminant(a: number, b: number, c: number): number {

    let D = b * b - a * c,
        E = b * b + a * c
    if (Math.abs(D) * 3 < E) {
        const ad = split(a),
            bd = split(b),
            cd = split(c),
            p = b * b,
            dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1],
            q = a * c,
            dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0])
                + ad[1] * cd[1]
        D = (p - q) + (dp - dq) // Don’t omit parentheses!
    }
    return D
}

function solveQuadratic(a: number, b: number, c: number): number[] {
    const roots = []
    if (Math.abs(a) < EPSILON) {
        if (Math.abs(b) >= EPSILON) {
            roots.push(-c / b)
        }
    } else {
        // a, b, c are expected to be the coefficients of the equation:
        // Ax² - 2Bx + C == 0, so we take b = -b/2:
        b *= -0.5
        var D = getDiscriminant(a, b, c)
        // If the discriminant is very small, we can try to normalize
        // the coefficients, so that we may get better accuracy.
        if (D && Math.abs(D) < MACHINE_EPSILON) {
            var f = getNormalizationFactor(Math.abs(a), Math.abs(b), Math.abs(c))
            if (f) {
                a *= f
                b *= f
                c *= f
                D = getDiscriminant(a, b, c)
            }
        }
        if (D >= -MACHINE_EPSILON) { // No real roots if D < 0
            var Q = D < 0 ? 0 : Math.sqrt(D),
                R = b + (b < 0 ? -Q : Q)
            // Try to minimize floating point noise.
            if (R === 0) {
                roots.push(c / a)
                roots.push(-c / a)
            } else {
                roots.push(R / a)
                roots.push(c / R)
            }
        }
    }
    return roots
}

export { solveQuadratic }