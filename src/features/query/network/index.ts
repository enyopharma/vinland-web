import Konva from 'konva'
import { Interaction, Protein, Node, Link } from 'features/query'
import { getLabels } from './labels';
import { getSelection } from './selection';
import { getSimulation } from './simulation';
import { getColorPicker } from './color'

const radius = 6

const style = {
    nodes: {
        radius: radius,
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
    return setUpStage(getNodesAndLinks(interactions))
}

const getNodesAndLinks = (interactions: Interaction[]) => {
    const nodes: Node[] = []
    const links: Link[] = []
    const map: Record<string, Node> = {}
    const associations: string[] = []
    const color = getColorPicker()

    const registerNode = (protein: Protein) => {
        const nodeid = `${protein.species.ncbi_taxon_id}:${protein.name}`
        const proteinid = `${protein.accession}:${protein.name}`

        let node = map[nodeid] ?? null

        if (node === null) nodes.push(node = map[nodeid] = {
            id: nodeid,
            data: {
                type: protein.type,
                name: protein.name,
                color: color(protein),
                species: protein.species.name,
                proteins: {},
            },
            selection: {},
        })

        if (!node.data.proteins[proteinid]) {
            node.data.proteins[proteinid] = protein
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

    return { nodes, links }
}

const setUpStage = (network: { nodes: Node[], links: Link[] }) => {
    const ui = { labels: getLabels(), selection: getSelection(network) }
    const simulation = getSimulation(network, { radius: radius })
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

                label.x(n.x + radius + style.nodes.stroke.width)
                label.y(n.y - (radius / 2))
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
        selectNeighbors: ui.selection.selectNeighbors,
        stop: simulation.stop,
        resize: (width: number) => {
            if (ref === null) return
            ref.width(width)
            ref.height(width * 2 / 3)
            ref.batchDraw()
        },
        save: () => {
            if (ref === null) return
            downloadURI(ref.toDataURL({ pixelRatio: 2 }), 'network.png')
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
                height: width * 2 / 3,
                x: posX ?? (width / 2),
                y: posY ?? (width / 3),
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
        radius: radius,
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

const link: { current: HTMLAnchorElement | null } = { current: null }

const downloadURI = (uri: string, name: string) => {
    link.current = document.createElement('a');
    link.current.download = name;
    link.current.href = uri;
    document.body.appendChild(link.current);
    link.current.click();
    document.body.removeChild(link.current);
    delete link.current;
}
