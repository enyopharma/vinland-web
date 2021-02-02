import Konva from 'konva'
import { scaleOrdinal } from 'd3-scale'
import { schemeSpectral } from 'd3-scale-chromatic'
import { Node, Link } from './types'
import { getUi } from './ui'
import { getSimulation } from './simulation'
import { config } from '../config'
import { Interaction, Protein } from '../types'

type Data = {
    nodes: Node[]
    links: Link[]
}

type Display = {
    nodes: Konva.Circle[]
    labels: Konva.Text[]
    links: Konva.Line[]
}

let ref: Konva.Stage | null = null

export const network = async (interactions: Interaction[]) => {
    /**
     * Destroy the ref when not empty.
     */
    if (ref !== null) ref.destroy()

    /**
     * Prepare the data.
     */
    let scale = 1
    let posX: number | null = null
    let posY: number | null = null

    const { data, display } = await parse(interactions)

    const simulation = getSimulation(data)

    const ui = getUi(data)

    /**
     * Create layers and add elements to it.
     */
    const nodes = new Konva.Layer()
    const labels = new Konva.FastLayer()
    const links = new Konva.FastLayer()

    nodes.add(...display.nodes)
    labels.add(...display.labels)
    links.add(...display.links)

    /**
     * Add listener on nodes layer.
     */
    nodes.on('click', e => {
        console.log('click', Math.random())
        e.cancelBubble = true
        ui.toggle(e.target.getAttr('ref'), e.evt.shiftKey)
    })

    nodes.on('dragmove', e => {
        e.target.getAttr('ref').fx = e.target.attrs.x
        e.target.getAttr('ref').fy = e.target.attrs.y
        simulation.restart(0.1)
    })

    nodes.on('dragend', () => {
        simulation.stop()
    })

    /**
     * return public api.
     */
    return {
        setRatio: simulation.setRatio,
        setLabels: ui.setLabelsVisibility,
        species: ui.species,
        onSelection: ui.onSelection,
        getSelection: ui.getSelection,
        selectNeighbors: ui.selectNeighbors,
        stop: simulation.stop,
        resize: (width: number) => {
            if (ref === null) return
            ref.width(width)
            ref.height(width * 1 / 2)
            ref.batchDraw()
        },
        image: () => {
            if (ref === null) return
            return ref.toDataURL({ pixelRatio: 2 })
        },
        remove: () => {
            if (ref === null) return
            ref.remove()
        },
        container: (container: HTMLDivElement) => {
            const width = container.clientWidth

            const stage = new Konva.Stage({
                container: container,
                width: width,
                height: width * 1 / 2,
                x: posX ?? (width / 2),
                y: posY ?? (width / 4),
                scaleX: scale,
                scaleY: scale,
                draggable: true,
            })

            stage.add(links)
            stage.add(nodes)
            stage.add(labels)

            const update = () => {
                links.find<Konva.Line>('Line').each(getDrawLink(ui))
                nodes.find<Konva.Circle>('Circle').each(getDrawNode(ui))
                labels.find<Konva.Text>('Text').each(getDrawLabel(ui))
                stage.batchDraw()
            }

            ui.register(update)
            simulation.register(update)

            /**
             * listeners on stage.
             */
            stage.on('click', ui.clear)

            stage.on('dragmove', () => {
                posX = stage.x()
                posY = stage.y()
            })

            stage.on('wheel', e => {
                e.evt.preventDefault()

                const x = stage.x()
                const y = stage.y()
                const pointer = stage.getPointerPosition()

                if (pointer === null) return

                const pointedX = pointer.x / scale - x / scale
                const pointedY = pointer.y / scale - y / scale

                scale = Math.min(Math.max(e.evt.deltaY > 0 ? scale / 1.1 : scale * 1.1, 0.1), 10)
                posX = -(pointedX - pointer.x / scale) * scale
                posY = -(pointedY - pointer.y / scale) * scale

                stage.scale({ x: scale, y: scale })
                stage.position({ x: posX, y: posY })

                stage.batchDraw()
            })

            /**
             * start the simulation.
             */
            simulation.start()

            /**
             * assign the stage to the ref
             */
            ref = stage
        }
    }
}

const style = {
    nodes: {
        radius: config.radius,
        stroke: {
            width: 1,
            color: {
                default: 'lightgrey',
                selected: 'gold',
            },
        },
        opacity: {
            max: 1,
            min: 0.2,
        },
    },
    links: {
        width: 1,
        color: 'grey',
        opacity: {
            max: 1,
            min: 0.2,
        },
    },
    labels: {
        font: {
            size: 8,
        }
    }
}

const scale = scaleOrdinal(schemeSpectral[11])

const getColorPicker = () => {
    let first_viral_species: number | null = null

    return (protein: Protein) => {
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
}

const getNodeCircle = (n: Node) => {
    const node = new Konva.Circle({
        radius: config.radius,
        fill: n.data.color,
        stroke: style.nodes.stroke.color.default,
        strokeWidth: style.nodes.stroke.width,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
        perfectDrawEnabled: false,
        draggable: true,
    });

    node.setAttr('ref', n)
    node.cache({ pixelRatio: 2 })

    return node
}

const getDrawNode = (ui: { isNodeSelected: (n: Node) => boolean, isNodeInNeighborhood: (n: Node) => boolean }) => {
    return (node: Konva.Circle) => {
        const n = node.getAttr('ref')

        if (n.x && n.y) {
            const prevstroke = node.stroke()
            const newstroke = ui.isNodeSelected(n)
                ? style.nodes.stroke.color.selected
                : style.nodes.stroke.color.default
            const opacity = ui.isNodeInNeighborhood(n)
                ? style.nodes.opacity.max
                : style.nodes.opacity.min

            node.x(n.x)
            node.y(n.y)
            node.stroke(newstroke)
            node.opacity(opacity)

            if (prevstroke !== newstroke) {
                node.cache({ pixelRatio: 2 })
            }
        }
    }
}

const getNodeLabel = (n: Node) => {
    const label = new Konva.Text({
        text: n.data.name,
        fontSize: style.labels.font.size,
        verticalAlign: 'middle',
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
        perfectDrawEnabled: false,
        visible: false,
    });

    label.setAttr('ref', n)
    label.cache({ pixelRatio: 2 })

    return label
}

const getDrawLabel = (ui: { isNodeInNeighborhood: (n: Node) => boolean, getLabelsVisibility: () => boolean }) => {
    return (label: Konva.Text) => {
        const n = label.getAttr('ref')

        if (n.x && n.y) {
            const visibility = ui.isNodeInNeighborhood(n) && ui.getLabelsVisibility()

            label.x(n.x + config.radius + style.nodes.stroke.width)
            label.y(n.y - (config.radius / 2))
            label.visible(visibility)
        }
    }
}

const getLinkLine = (l: Link) => {
    const link = new Konva.Line({
        stroke: style.links.color,
        strokeWidth: style.links.width,
        points: [],
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
        perfectDrawEnabled: false,
        closed: l.source === l.target,
    })

    link.setAttr('ref', l)

    return link
}

const getDrawLink = (ui: { isLinkInNeighborhood: (l: Link) => boolean }) => {
    return (link: Konva.Line) => {
        const l = link.getAttr('ref')

        if (l.source.x && l.source.y && l.target.x && l.target.y) {
            const points = [l.source.x, l.source.y]
            const tension = l.source === l.target ? 0.5 : 0
            const opacity = ui.isLinkInNeighborhood(l)
                ? style.links.opacity.max
                : style.links.opacity.min

            l.source === l.target
                ? points.push(l.target.x + 5, l.target.y + 20, l.target.x, l.target.y + 30, l.target.x - 5, l.target.y + 20)
                : points.push(l.target.x, l.target.y)

            link.points(points)
            link.tension(tension)
            link.opacity(opacity)
        }
    }
}

const parse = (interactions: Interaction[]) => {
    const circles: Konva.Circle[] = []
    const labels: Konva.Text[] = []
    const lines: Konva.Line[] = []
    const links: Link[] = []
    const map: Record<string, Node> = {}
    const associations: Record<string, boolean> = {}

    const color = getColorPicker()

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

            circles.push(getNodeCircle(node))
            labels.push(getNodeLabel(node))
        }

        if (!node.data.proteins[protein.id]) {
            node.data.proteins[protein.id] = protein
        }

        return node
    }

    return new Promise<{ data: Data, display: Display }>(resolve => {
        const add = (i: number) => {
            setTimeout(() => {
                if (i === interactions.length) {
                    resolve({
                        data: { nodes: Object.values(map), links },
                        display: { nodes: circles, labels: labels, links: lines },
                    })
                } else {
                    let k = 0
                    for (let j = i; j < interactions.length && k < 100; j++, k++) {
                        const node1 = registerNode(interactions[j].protein1)
                        const node2 = registerNode(interactions[j].protein2)

                        if (!associations[`${node1.id}:${node2.id}`]) {
                            const link = { source: node1, target: node2, selection: {} }

                            links.push(link)
                            lines.push(getLinkLine(link))

                            associations[`${node1.id}:${node2.id}`] = true
                            associations[`${node2.id}:${node1.id}`] = true
                        }
                    }
                    add(i + k)
                }
            })
        }
        add(0)
    })
}
