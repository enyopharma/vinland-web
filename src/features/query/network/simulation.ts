import * as d3 from 'd3-force'
import { Node, Link } from 'features/query'
import { config } from 'features/query'

export const getSimulation = (network: { nodes: Node[], links: Link[] }) => {
    let ratio = config.ratio

    const forces = {
        x: d3.forceX(),
        y: d3.forceY(),
        center: d3.forceCenter(),
        links: d3.forceLink<Node, Link>(network.links).id(n => n.id),
        charge: d3.forceManyBody(),
        collide: d3.forceCollide(config.radius)
    }

    const simulation = d3.forceSimulation(network.nodes)
        .force('x', forces.x)
        .force('y', forces.y)
        .force('center', forces.center)
        .force('links', forces.links.distance(ratio * 0.01))
        .force('charge', forces.charge.strength(-ratio))
        .force('collide', forces.collide)

    const setRatio = (value: number) => {
        if (value === ratio) return

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
