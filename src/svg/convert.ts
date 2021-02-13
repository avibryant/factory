import { parse } from './svgd.js'
import { Path, Segment } from '../geom/path'
import { line } from '../geom/line'
import { Point, distance } from '../geom/point'
import { cubic } from './cubic'
import { cubicArcs } from './biarc'
import { arc, sweepAngle } from '../geom/arc'

type CommandName =
    "z" | "Z" | "h" | "H" | "v" | "V" |
    "m" | "M" | "l" | "L" | "s" | "S" |
    "c" | "C"

interface Command {
    name: CommandName
    args: number[][]
}

class Interpreter {
    paths: Path[] = []
    start?: Point
    position?: Point

    run(cmd: Command) {
        cmd.args.forEach((a) => {
            switch (cmd.name) {
                case "z":
                case "Z":
                    this.close()
                    break
                case "m":
                    this.move(this.relative(a))
                    break
                case "M":
                    this.move(this.absolute(a))
                    break
                case "l":
                    this.line(this.relative(a))
                    break
                case "L":
                    this.line(this.absolute(a))
                    break
                case "c":
                    this.cubic(
                        this.relative(a.slice(4, 6)),
                        this.relative(a.slice(0, 2)),
                        this.relative(a.slice(2, 4)))
                    break
                case "C":
                    this.cubic(
                        this.absolute(a.slice(4, 6)),
                        this.absolute(a.slice(0, 2)),
                        this.absolute(a.slice(2, 4)))
                    break
                default:
                    throw new Error("Not yet implemented: " + cmd.name)
            }
        })
    }

    private absolute(pair: number[]): Point {
        return {
            x: pair[0] / 72,
            y: pair[1] / -72
        }
    }

    private relative(pair: number[]): Point {
        const delta = this.absolute(pair)
        return {
            x: delta.x + this.position.x,
            y: delta.y + this.position.y
        }
    }

    private close() {
        this.position = this.start
        this.currentPath().closed = true
        this.paths.push({ segments: [], closed: false })
    }

    private move(pt: Point) {
        this.position = pt
        this.start = pt
        this.paths.push({ segments: [], closed: false })
    }

    private currentPath() {
        return this.paths[this.paths.length - 1]
    }

    private currentSegments() {
        return this.currentPath().segments
    }

    private line(pt: Point) {
        this.currentSegments().push(line(this.position, pt))
        this.position = pt
    }

    private arc(pt: Point, center: Point, cw: boolean) {
        this.currentSegments().push(arc(this.position, pt, center, cw))
        this.position = pt
    }

    private cubic(pt: Point, c1: Point, c2: Point) {
        const c = cubic(this.position, pt, c1, c2)
        const arcs = cubicArcs(c, 1)
        arcs.forEach(a => this.arc(a.p2, a.center, a.cw))
    }
}

function fromSVG(path: string): Path[] {
    const commands = <Command[]>parse(path)
    const interp = new Interpreter()
    commands.forEach(cmd => interp.run(cmd))
    return interp.paths
}

function formatPt(pt: Point): string {
    return pt.x + " " + pt.y
}

function format(segment: Segment): string {
    if (segment.type == "line") {
        return "L " + formatPt(segment.p2)
    } else {
        const r = distance(segment.p1, segment.center)
        const large = Math.abs(sweepAngle(segment)) > Math.PI
        return ["A", r, r, 0, large ? 1 : 0, segment.cw ? 1 : 0, formatPt(segment.p2)].join(" ")
    }
}

function toSVG(path: Path): string {
    const segments = path.segments.map(s => format(s))
    if (path.closed)
        segments.push("Z")
    segments.unshift("M " + formatPt(path.segments[0].p1))
    return segments.join(" ")
}

export { fromSVG, toSVG }