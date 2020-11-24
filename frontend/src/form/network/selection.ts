import { Taxon } from '../types'
import { Node, Link } from './types'

export const getSelection = ({ nodes, links }: { nodes: Node[], links: Link[] }) => {
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

    const selectSpecies = (ncbi_taxon_id: number) => {
        selected = []

        nodes.forEach(n => {
            if (n.data.species.ncbi_taxon_id === ncbi_taxon_id) selected.push(n)
        })

        trigger()
    }

    const selectNeighbors = () => {
        nodes.forEach(n => {
            if (n.selection.neighborhood === current) selected.push(n)
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

    // build the species from the node
    const map: Record<number, { species: Taxon, color: string, select: () => void }> = {}

    nodes.forEach(n => {
        if (!map[n.data.species.ncbi_taxon_id]) {
            map[n.data.species.ncbi_taxon_id] = {
                species: n.data.species,
                color: n.data.color,
                select: () => selectSpecies(n.data.species.ncbi_taxon_id),
            }
        }
    })

    const species = Object.values(map).sort((a, b) => a.species.ncbi_taxon_id - b.species.ncbi_taxon_id)

    return {
        toggle,
        clear,
        species,
        selectNeighbors,
        isNodeSelected,
        isNodeInNeighborhood,
        isLinkInNeighborhood,
        register,
    }
}
