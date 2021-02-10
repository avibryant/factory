import { Line } from './line'
import { Arc } from './arc'

type Segment = Line | Arc

interface Path {
    segments: Segment[]
    closed: boolean
}

export { Path, Segment }