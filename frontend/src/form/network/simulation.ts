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

    return new Promise<{ nodes: Node[], links: Link[] }>(resolve => {
        const add = (i: number) => {
            setTimeout(() => {
                if (i === interactions.length) {
                    resolve({ nodes: Object.values(map), links })
                } else {
                    let k = 0
                    for (let j = i; j < interactions.length && k < 10; j++, k++) {
                        const node1 = registerNode(interactions[j].protein1)
                        const node2 = registerNode(interactions[j].protein2)

                        if (!associations.includes(`${node1.id}:${node2.id}`)) {
                            links.push({ source: node1, target: node2, selection: {} })

                            associations.push(`${node1.id}:${node2.id}`)
                            associations.push(`${node2.id}:${node1.id}`)
                        }
                    }
                    add(i + k)
                }
            })
        }
        add(0)
    })
}

export const getSimulation = async (interactions: Interaction[]) => {
    let ratio = config.ratio
    let started = false

    const { nodes, links } = await getNodesAndLinks(interactions)

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
        .stop()

    const start = () => {
        if (!started) {
            simulation.alphaTarget(0.3).restart()
        }

        started = true
    }

    const restart = (alpha: number = 0.3) => simulation.alphaTarget(alpha).restart()

    const register = (listener: () => void) => simulation.on('tick', listener)

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
        start: start,
        restart: restart,
        stop: simulation.stop,
        register: register,
        setRatio: setRatio,
    }
}
