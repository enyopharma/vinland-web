import Konva from 'konva'
import { config } from '../config'
import { Node, Link } from './types'
import { getUi } from './ui'
import { getSimulation } from './simulation'
import { Interaction } from '../types'

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

export const network = async (interactions: Interaction[]) => {
    const simulation = await getSimulation(interactions)

    const [nodes, labels, links] = await getData(simulation)

    const ui = getUi(simulation)

    /**
     * Set up the layers, elements and listeners.
     */
    const layers = {
        nodes: new Konva.Layer(),
        labels: new Konva.FastLayer(),
        links: new Konva.FastLayer(),
    }

    layers.nodes.add(...nodes)
    layers.labels.add(...labels)
    layers.links.add(...links)

    /**
     * return public api.
     */
    let ref: Konva.Stage | null = null

    /**
     * Session scale and pos variables.
     */
    let scale = 1
    let posX: number | null = null
    let posY: number | null = null

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
        save: () => {
            if (ref === null) return
            window.open(ref.toDataURL({ pixelRatio: 2 }))
        },
        remove: () => {
            if (ref === null) return
            ref.removeChildren()
            ref.destroy()
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

            stage.add(layers.labels)
            stage.add(layers.links)
            stage.add(layers.nodes)

            const update = () => {
                layers.nodes.find<Konva.Circle>('Circle').each(getDrawNode(ui))
                layers.labels.find<Konva.Text>('Text').each(getDrawLabel(ui))
                layers.links.find<Konva.Line>('Line').each(getDrawLink(ui))
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
             * listeners on nodes layer.
             */
            layers.nodes.on('click', e => {
                e.cancelBubble = true
                ui.toggle(e.target.getAttr('ref'), e.evt.shiftKey)
            })

            layers.nodes.on('dragmove', e => {
                e.target.getAttr('ref').fx = e.target.attrs.x
                e.target.getAttr('ref').fy = e.target.attrs.y
                simulation.restart(0.1)
            })

            layers.nodes.on('dragend', () => {
                simulation.stop()
            })

            /**
             * start the simulation.
             */
            simulation.start()

            return ref = stage
        }
    }
}

const getNode = (n: Node) => {
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

const getLabel = (n: Node) => {
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

const getLink = (l: Link) => {
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

const getData = async (simulation: { nodes: Node[], links: Link[] }): Promise<[Konva.Circle[], Konva.Text[], Konva.Line[]]> => {
    const addN = new Promise<[Konva.Circle[], Konva.Text[]]>(resolve => {
        const nodes: Konva.Circle[] = []
        const labels: Konva.Text[] = []

        const add = (i: number) => setTimeout(() => {
            if (i === simulation.nodes.length) {
                resolve([nodes, labels])
            } else {
                let k = 0
                for (let j = i; j < simulation.nodes.length && k < 100; j++, k++) {
                    nodes.push(getNode(simulation.nodes[j]))
                    labels.push(getLabel(simulation.nodes[j]))
                }
                add(i + k)
            }
        })
        add(0)
    })

    const addL = new Promise<Konva.Line[]>(resolve => {
        const links: Konva.Line[] = []

        const add = (i: number) => setTimeout(() => {
            if (i === simulation.links.length) {
                resolve(links)
            } else {
                let k = 0
                for (let j = i; j < simulation.links.length && k < 100; j++, k++) {
                    links.push(getLink(simulation.links[j]))
                }
                add(i + k)
            }
        })
        add(0)
    })

    return Promise.all([addN, addL]).then(values => [values[0][0], values[0][1], values[1]])
}
