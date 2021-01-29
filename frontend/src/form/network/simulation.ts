import * as d3 from 'd3-force'
import { Node, Link } from './types'
import { config } from '../config'

export const getSimulation = ({ nodes, links }: { nodes: Node[], links: Link[] }) => {
    let ratio = config.ratio
    let started = false

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
        start: start,
        restart: restart,
        stop: simulation.stop,
        register: register,
        setRatio: setRatio,
    }
}
