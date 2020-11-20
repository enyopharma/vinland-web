import { Isoform, Mapping } from './types'

export const canonicalIndex = (isoforms: Isoform[]) => {
    for (let i = 0; i < isoforms.length; i++) {
        if (isoforms[i].is_canonical) return i
    }

    throw new Error('canonical isoform id error')
}

export const clusters = (mappings: Mapping[]): Array<Mapping[]> => {
    if (mappings.length === 0) return []

    const curr = []
    const rest = []

    const sorted = mappings.sort((a, b) => a.start - b.start)

    let laststop = 0

    for (let i = 0; i < mappings.length; i++) {
        if (sorted[i].start > laststop) {
            curr.push(sorted[i])
            laststop = sorted[i].stop
        } else {
            rest.push(sorted[i])
        }
    }

    return rest.length > 0 ? [curr].concat(clusters(rest)) : [curr]
}
