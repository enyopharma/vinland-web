import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force'
import { Protein, Taxon } from '../types'

export interface Node extends SimulationNodeDatum {
    id: string,
    data: {
        type: Protein['type']
        name: string
        color: string
        species: Taxon
        proteins: Record<string, Protein>
    },
    selection: {
        current?: number
        neighborhood?: number
    },
}

export interface Link extends SimulationLinkDatum<Node> {
    source: Node
    target: Node
    selection: {
        neighborhood?: number
    }
}
