import { fromSVG, toSVG } from './svg/convert'
import { format, path } from './gcode/gcode'
import * as xml from 'xml2js'
import * as fs from 'fs'

const input = fs.readFileSync(0, 'utf8')
xml.parseString(input, (err, res) => {
    const paths = res.svg.path.flatMap(g => fromSVG(g.$.d))
    const ds = paths.map(p => toSVG(p))
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
})
