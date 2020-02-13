import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force'

import { Interaction, Protein } from 'features/query'

const radius = 10

interface Node extends SimulationNodeDatum {
    id: string
    data: {
        type: 'h' | 'v'
        name: string
        species: {
            ncbi_taxon_id: number
        }
    }
}

interface Link extends SimulationLinkDatum<Node> {
    source: string
    target: string
    data: {
        degree: number
    }
}

type Props = {
    interactions: Interaction[]
}

export const NetworkD3: React.FC<Props> = ({ interactions }) => {
    let domref: Element | null = null

    useEffect(() => {
        if (domref === null) return
        return setUpD3(domref, interactions)
    }, [domref, interactions])

    return <svg
        width="100%"
        height="600px"
        viewBox="-300 -300 600 600"
        ref={ref => domref = ref}
    ></svg>
}

const id = (protein: Protein) => `${protein.species.ncbi_taxon_id}:${protein.name}`

const node = (id: string, protein: Protein) => ({
    id: id,
    data: {
        type: protein.type,
        name: protein.name,
        species: {
            ncbi_taxon_id: protein.species.ncbi_taxon_id,
        },
    }
})

const interactions2network = (interactions: Interaction[]) => {
    const ids: string[] = []
    const associations: string[] = []

    const nodes: Node[] = []
    const links: Link[] = []

    interactions.forEach(interaction => {
        const id1 = id(interaction.protein1)
        const id2 = id(interaction.protein2)

        if (!ids.includes(id1)) {
            ids.push(id1)
            nodes.push(Object.create(node(id1, interaction.protein1)))
        }

        if (!ids.includes(id2)) {
            ids.push(id2)
            nodes.push(Object.create(node(id2, interaction.protein2)))
        }

        if (!associations.includes(id1 + id2)) {
            associations.push(id1 + id2)
            associations.push(id2 + id1)
            links.push(Object.create({ source: id1, target: id2 }))
        }
    })

    return { nodes, links, associations }
}

const getColorPicker = () => {
    let firstViralSpecies: number | null = null
    const scale = d3.scaleOrdinal(d3.schemeSet3);

    return (node: Node) => {
        if (node.data.type === 'h') {
            return 'blue'
        }

        if (firstViralSpecies === null) {
            firstViralSpecies = node.data.species.ncbi_taxon_id
        }

        if (node.data.species.ncbi_taxon_id === firstViralSpecies) {
            return 'red'
        }

        return scale(node.data.species.ncbi_taxon_id.toString())
    }
}

const setUpD3 = (domref: Element, interactions: Interaction[]) => {
    const network = interactions2network(interactions)

    const nodes = network.nodes.map(d => Object.create(d))
    const links = network.links.map(d => Object.create(d))

    // colors
    const color = getColorPicker()

    // build svg
    const svg = d3.select(domref)

    const container = svg.append('g')

    const link = container.append('g')
        .selectAll<SVGLineElement, Link>('line')
        .data(links)
        .join('line')
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('z-index', 1)

    const node = container.append('g')
        .selectAll<SVGCircleElement, Node>('circle')
        .data(nodes)
        .join('g')
        .attr('z-index', 2)

    const circle = node.append('circle')
        .attr('r', radius)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('z-index', 3)

    const label = node.append('text')
        .text((d: Node) => d.data.name)
        .attr('fill', 'black')
        .attr('font-size', radius + 1)
        .attr('pointer-events', 'none')
        .attr('z-index', 4)

    // run simulation
    const simulation = d3.forceSimulation<Node, Link>(nodes)
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force('center', d3.forceCenter())
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink<Node, Link>(links).id(d => d.id))
        .force("link", d3.forceLink<Node, Link>(links).distance(radius * 5))

    simulation.on('tick', () => {
        circle
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        label
            .attr('x', d => d.x + radius)
            .attr('y', d => d.y + ((radius - 1) / 2))

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
    });

    simulation.on('end', () => {
        const snode = svg.node()
        const cnode = container.node()
        if (snode === null || cnode === null) return
        console.log(cnode.getBBox())
    })

    // zoom
    const zoomed = () => container.attr('transform', d3.event.transform)

    const zoom = d3.zoom().scaleExtent([0.1, 10]).on('zoom', zoomed)

    svg.call(zoom)

    // node dragging
    const dragstarted = (d: SimulationNodeDatum) => {
        d3.event.sourceEvent.stopPropagation()
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
    }

    const dragged = (d: SimulationNodeDatum) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    const dragended = (d: SimulationNodeDatum) => {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    const drag = d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)

    circle.call(drag)

    // node highlighting
    svg.on('click', () => {
        node.attr('opacity', 1)
        circle.attr('stroke', 'white')
        link.attr('opacity', 1)
    })

    node.on('click', n => {
        d3.event.stopPropagation()
        circle.attr('stroke', d => n.id === d.id ? 'gold' : 'white')
        node.attr('opacity', d => n.id === d.id || network.associations.includes(n.id + d.id) ? 1 : 0.2)
        link.attr('opacity', l => n.index === l.source.index || n.index === l.target.index ? 1 : 0.2)
    })

    // cleanup function
    return () => {
        simulation.stop()
        svg.selectAll('*').remove()
    }
}
