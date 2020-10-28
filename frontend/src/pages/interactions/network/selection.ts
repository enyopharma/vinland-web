import { Node, Link } from './types'

export const getSelection = ({ links }: { links: Link[] }) => {
    let current = 0
    let selected: Node[] = []
    let listener: (() => any) | null = null

    const updateNodes = () => selected.forEach(n => {
        n.selection.current = current
        n.selection.neighborhood = current
    })

    const updateNeighborhood = () => links.forEach((l) => {
        if (l.source.selection.current === current || l.target.selection.current === current) {
            l.selection.neighborhood = current
            l.source.selection.neighborhood = current
            l.target.selection.neighborhood = current
        }
    })

    const trigger = () => {
        current++

        updateNodes()
        updateNeighborhood()

        if (listener === null) return

        listener()
    }

    const select = (n: Node) => {
        selected = [n]
        trigger()
    }

    const append = (n: Node) => {
        selected.push(n)
        trigger()
    }

    const unselect = (n: Node) => {
        selected = selected.filter(s => s !== n)
        trigger()
    }

    const selectNeighbors = () => {
        links.forEach((l) => {
            if (l.source.selection.neighborhood === current) selected.push(l.source)
            if (l.target.selection.neighborhood === current) selected.push(l.target)
        })

        trigger()
    }

    const clear = () => {
        selected = []
        trigger()
    }

    const toggle = (n: Node, append: boolean) => append ? toggleAppend(n) : toggleSelect(n)

    const toggleSelect = (n: Node) => selected.includes(n) ? unselect(n) : select(n)

    const toggleAppend = (n: Node) => selected.includes(n) ? unselect(n) : append(n)

    const isNodeSelected = (n: Node) => {
        return n.selection.current === current
    }

    const isNodeInNeighborhood = (n: Node) => {
        if (selected.length === 0) return true
        return n.selection.neighborhood === current
    }

    const isLinkInNeighborhood = (l: Link) => {
        if (selected.length === 0) return true
        return l.selection.neighborhood === current
    }

    const register = (fn: () => any) => listener = fn

    return {
        toggle,
        clear,
        selectNeighbors,
        isNodeSelected,
        isNodeInNeighborhood,
        isLinkInNeighborhood,
        register,
    }
}
