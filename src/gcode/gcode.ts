import { Path, Segment } from '../geom/path'
import { Point, distance } from '../geom/point'

type GSym = "G0" | "G1" | "G2" | "G3" | "M3" | "M5"

interface GCode {
    sym: GSym
    x?: number
    y?: number
    z?: number
    r?: number
}

function goTo(pt: Point): GCode {
    return { x: pt.x, y: pt.y, sym: "G0" }
}

function line(pt: Point): GCode {
    return { x: pt.x, y: pt.y, sym: "G1" }
}

function z(z: number): GCode {
    return { z, sym: "G0" }
}

function arc(pt: Point, r: number, cw: boolean): GCode {
    return { x: pt.x, y: pt.y, r, sym: cw ? "G3" : "G2" }
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
    if (gc.x != undefined) {
        parts.push("X")
        parts.push(gc.x)
    }
    if (gc.y != undefined) {
        parts.push("Y")
        parts.push(gc.y)
    }
    if (gc.z != undefined) {
        parts.push("Z")
        parts.push(gc.z)
    }
    if (gc.r != undefined) {
        parts.push("R")
        parts.push(gc.r)
    }
    return parts.join(" ")
}

function segment(s: Segment): GCode {
    if (s.type == "line") {
        return line(s.p2)
    } else {
        return arc(s.p2, distance(s.center, s.p2), s.cw)
    }
}

function path(p: Path): GCode[] {
    const gcode = []
    gcode.push(goTo(p.segments[0].p1))
    p.segments.forEach(s => gcode.push(segment(s)))
    if (p.closed) {
        gcode.push(line(p.segments[0].p1))
    }
    return gcode
}

export {
    GCode, format,
    spindle, arc, z, line, goTo, path
}