import { parse } from './svgd.js'
import { GCode, arc, format } from './gcode'

type CommandName =
    "z" | "Z" | "h" | "H" | "v" | "V" |
    "m" | "M" | "l" | "L" | "s" | "S" |
    "c" | "C"

interface Command {
    name: CommandName
    args: number[][]
}

interface Point {
    x: number
    y: number
}

class Interpreter {
    gcodes: GCode[] = []
    start?: Point
    position?: Point

    run(cmd: Command) {
        switch (cmd.name) {
            case "z":
            case "Z":
                this.close()
            default:
                throw new Error("Not yet implemented: " + cmd.name)
        }
    }

    private close() {

    }
}

function convert(path: string): string {
    const commands = <Command[]>parse(path)
    const interp = new Interpreter()
    commands.forEach(cmd => interp.run(cmd))
    return interp.gcodes.map(gc => format(gc)).join("\n")
}

export { convert }