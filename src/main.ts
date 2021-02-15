import { fromSVG, toSVG } from './svg/convert'
import { format, path } from './gcode/gcode'
import { Shape } from './geom/shape'
import { Path } from './geom/path'
import * as xml from 'xml2js'
import * as fs from 'fs'

function findShapes(svg: any): Shape[] {
    const results: Shape[] = []
    if (svg.path) {
        results.push(...svg.path.map(g => fromSVG(g.$.d)))
    }
    if (svg.g) {
        results.push(...svg.g.flatMap(g => findShapes(g)))
    }
    return results
}

const input = fs.readFileSync(0, 'utf8')
xml.parseString(input, (err, res) => {
    const shapes = findShapes(res.svg)
    const ds = shapes.map(p => toSVG(p))
    const svg = {
        svg: {
            $: {
                "xmlns": "http://www.w3.org/2000/svg"
            },
            path: ds.map(d => {
                return {
                    $: {
                        d: d,
                        stroke: "black"
                    }
                }
            })
        }
    }
    const builder = new xml.Builder()
    const x = builder.buildObject(svg)

    console.log(x)
    //    shapes.forEach(s => s.paths.forEach(p => path(p).forEach(g => console.log(format(g)))))
})
