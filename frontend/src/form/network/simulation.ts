import * as d3 from 'd3-force'
import { config } from '../config'
import { Node, Link } from './types'
import { scaleOrdinal } from 'd3-scale'
import { schemeSpectral } from 'd3-scale-chromatic'
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

const getNodesAndLinks = (interactions: Interaction[]) => {
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

export const getSimulation = (interactions: Interaction[]) => {
    let ratio = config.ratio

    const { nodes, links } = getNodesAndLinks(interactions)

    const forces = {
        x: d3.forceX(),
        y: d3.forceY(),
        center: d3.forceCenter(),
        links: d3.forceLink<Node, Link>(links).id(n => n.id),
        charge: d3.forceManyBody(),
        collide: d3.forceCollide(config.radius)
    }

    const simulation = d3.forceSimulation(nodes)
        .force('x', forces.x)
        .force('y', forces.y)
        .force('center', forces.center)
        .force('links', forces.links.distance(ratio * 0.01))
        .force('charge', forces.charge.strength(-ratio))
        .force('collide', forces.collide)

    const setRatio = (value: number) => {
        if (value === ratio) return

        nodes.forEach(node => {
            node.fx = null
            node.fy = null
        })

        ratio = value

        forces.links.distance(ratio * 0.01)
        forces.charge.strength(-ratio)

        simulation.alphaTarget(0.3).restart()
    }

    return {
        on: simulation.on,
        nodes: simulation.nodes(),
        links: forces.links.links(),
        stop: simulation.stop,
        alphaTarget: simulation.alphaTarget,
        setRatio: setRatio,
    }
}
