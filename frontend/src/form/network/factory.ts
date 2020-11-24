import { scaleOrdinal } from 'd3-scale'
import { schemeSpectral } from 'd3-scale-chromatic'
import { Node, Link } from './types'
import { Interaction, Protein } from '../types'

const scale = scaleOrdinal(schemeSpectral[11])

let first_viral_species: number | null = null

const color = (protein: Protein) => {
    if (protein.type === 'h') {
        return 'blue'
    }

    if (first_viral_species === null) {
        first_viral_species = protein.species.ncbi_taxon_id
    }

    if (protein.species.ncbi_taxon_id === first_viral_species) {
        return 'red'
    }

    return scale(protein.species.ncbi_taxon_id.toString())
}

export const getNetwork = (interactions: Interaction[]) => {
    const links: Link[] = []
    const map: Record<string, Node> = {}
    const associations: string[] = []

    const registerNode = (protein: Protein) => {
        const nodeid = `${protein.species.ncbi_taxon_id}:${protein.name}`

        let node = map[nodeid] ?? null

        if (node === null) {
            node = map[nodeid] = {
                id: nodeid,
                data: {
                    type: protein.type,
                    name: protein.name,
                    color: color(protein),
                    species: protein.species,
                    proteins: {},
                },
                selection: {},
            }
        }

        if (!node.data.proteins[protein.id]) {
            node.data.proteins[protein.id] = protein
        }

        return node
    }

    interactions.forEach(interaction => {
        const node1 = registerNode(interaction.protein1)
        const node2 = registerNode(interaction.protein2)

        if (!associations.includes(`${node1.id}:${node2.id}`)) {
            links.push({ source: node1, target: node2, selection: {} })

            associations.push(`${node1.id}:${node2.id}`)
            associations.push(`${node2.id}:${node1.id}`)
        }
    })

    return { nodes: Object.values(map), links }
}
