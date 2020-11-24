import Konva from 'konva'
import { config } from '../config'
import { Interaction } from '../types'
import { Node, Link } from './types'
import { getLabels } from './labels'
import { getNetwork } from './factory'
import { getSelection } from './selection'
import { getSimulation } from './simulation'

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

export const network = (interactions: Interaction[]) => {
    const network = getNetwork(interactions)
    const simulation = getSimulation(network)
    const ui = { labels: getLabels(), selection: getSelection(network) }
    const listeners: Array<() => void> = []

    /**
     * Session stage.
     */
    let ref: Konva.Stage | null = null

    /**
     * Session scale and pos variables.
     */
    let scale = 1
    let posX: number | null = null
    let posY: number | null = null

    /**
     * Set up the layers.
     */
    const nodes = new Konva.Layer()
    const links = new Konva.FastLayer()
    const labels = new Konva.FastLayer()

    nodes.on('click', e => {
        e.cancelBubble = true
        ui.selection.toggle(e.target.getAttr('ref'), e.evt.shiftKey)
    })

    nodes.on('dragstart', e => {
        e.target.getAttr('ref').fx = e.target.attrs.x
        e.target.getAttr('ref').fy = e.target.attrs.y
    })

    nodes.on('dragmove', e => {
        simulation.alphaTarget(0.3).restart()
        e.target.getAttr('ref').fx = e.target.attrs.x
        e.target.getAttr('ref').fy = e.target.attrs.y
    })

    nodes.on('dragend', e => {
        e.target.getAttr('ref').fx = null
        e.target.getAttr('ref').fy = null
    })

    /**
     * register the nodes.
     */
    simulation.nodes.forEach(n => {
        const node = getNode(n)
        const label = getLabel(n)

        nodes.add(node)
        labels.add(label)

        listeners.push(() => {
            if (n.x && n.y) {
                const prevstroke = node.stroke()
                const newstroke = ui.selection.isNodeSelected(n)
                    ? style.nodes.stroke.color.selected
                    : style.nodes.stroke.color.default
                const opacity = ui.selection.isNodeInNeighborhood(n)
                    ? style.nodes.opacity.max
                    : style.nodes.opacity.min

                node.x(n.x)
                node.y(n.y)
                node.stroke(newstroke)
                node.opacity(opacity)
                if (prevstroke !== newstroke) node.cache({ pixelRatio: 2 })

                const visibility = ui.selection.isNodeInNeighborhood(n) && ui.labels.visibility()

                label.x(n.x + config.radius + style.nodes.stroke.width)
                label.y(n.y - (config.radius / 2))
                label.visible(visibility)
            }
        })
    })

    /**
     * register the links.
     */
    simulation.links.forEach(l => {
        const link = getLink(l)

        links.add(link)

        listeners.push(() => {
            if (l.source.x && l.source.y && l.target.x && l.target.y) {
                const points = [l.source.x, l.source.y]
                const tension = l.source === l.target ? 0.5 : 0
                const opacity = ui.selection.isLinkInNeighborhood(l)
                    ? style.links.opacity.max
                    : style.links.opacity.min

                l.source === l.target
                    ? points.push(l.target.x + 5, l.target.y + 20, l.target.x, l.target.y + 30, l.target.x - 5, l.target.y + 20)
                    : points.push(l.target.x, l.target.y)

                link.points(points)
                link.tension(tension)
                link.opacity(opacity)
            }
        })
    })

    /**
     * return public api.
     */
    return {
        setRatio: simulation.setRatio,
        setLabels: ui.labels.setVisibility,
        species: ui.selection.species,
        onSelection: ui.selection.onSelection,
        getSelection: ui.selection.getSelection,
        selectNeighbors: ui.selection.selectNeighbors,
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

            stage.add(links)
            stage.add(nodes)
            stage.add(labels)

            const update = () => {
                listeners.forEach(listener => listener())
                stage.batchDraw()
            }

            ui.labels.register(update)
            ui.selection.register(update)
            simulation.on('tick', update)

            stage.on('click', ui.selection.clear)

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

    label.cache({ pixelRatio: 2 })

    return label
}

const getLink = (l: Link) => {
    return new Konva.Line({
        stroke: style.links.color,
        strokeWidth: style.links.width,
        points: [],
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
        perfectDrawEnabled: false,
        closed: l.source === l.target,
    })
}
