
type GSym = "G0" | "G1" | "G2" | "G3" | "M3" | "M5"

interface GCode {
    sym: GSym
    x?: number
    y?: number
    z?: number
    r?: number
}

function goTo(x: number, y: number): GCode {
    return { x, y, sym: "G0" }
}

function line(x: number, y: number): GCode {
    return { x, y, sym: "G1" }
}

function z(z: number): GCode {
    return { z, sym: "G0" }
}

function arc(x: number, y: number, r: number, cw: boolean): GCode {
    return { x, y, r, sym: cw ? "G2" : "G3" }
}

function spindle(on: boolean): GCode {
    if (on) {
        return { sym: "M3" }
    } else {
        return { sym: "M5" }
    }
}

function format(gc: GCode): string {
    const parts = []
    parts.push(gc.sym)
    if (gc.x) {
        parts.push("X")
        parts.push(gc.x)
    }
    if (gc.y) {
        parts.push("Y")
        parts.push(gc.y)
    }
    if (gc.z) {
        parts.push("Z")
        parts.push(gc.z)
    }
    if (gc.r) {
        parts.push("R")
        parts.push(gc.r)
    }
    return parts.join(" ")
}

export {
    GCode, format,
    spindle, arc, z, line, goTo,
}