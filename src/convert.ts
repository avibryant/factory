import { parse } from './svgd.js'
import { GCode, line, goTo, format, arc } from './gcode'
import { Point, distance } from './point'
import { Arc, cubicArcs } from './arc'
import { Cubic, cubic } from './cubic'

type CommandName =
    "z" | "Z" | "h" | "H" | "v" | "V" |
    "m" | "M" | "l" | "L" | "s" | "S" |
    "c" | "C"

interface Command {
    name: CommandName
    args: number[][]
}

class Interpreter {
    gcodes: GCode[] = []
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

    private relative(pair: number[]): Point {
        return {
            x: pair[0] + this.position.x,
            y: pair[1] + this.position.y
        }
    }

    private absolute(pair: number[]): Point {
        return {
            x: pair[0],
            y: pair[1]
        }
    }

    private close() {
        this.line(this.start)
    }

    private move(pt: Point) {
        this.gcodes.push(goTo(pt.x, pt.y))
        this.position = pt
        if (!this.start)
            this.start = pt
    }

    private line(pt: Point) {
        this.gcodes.push(line(pt.x, pt.y))
        this.position = pt
    }

    private arc(pt: Point, center: Point, cw: boolean) {
        this.gcodes.push(arc(pt.x, pt.y, distance(pt, center), cw))
        this.position = pt
    }

    private cubic(pt: Point, c1: Point, c2: Point) {
        const c = cubic(this.position, pt, c1, c2)
        const arcs = cubicArcs(c, 100)
        const cw = false //TODO
        arcs.forEach(a => this.arc(a.p2, a.center, cw))
    }
}

function convert(path: string): string {
    const commands = <Command[]>parse(path)
    const interp = new Interpreter()
    commands.forEach(cmd => interp.run(cmd))
    return interp.gcodes.map(gc => format(gc)).join("\n")
}

export { convert }