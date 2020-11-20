import { Isoform } from './types'

export const canonicalIndex = (isoforms: Isoform[]) => {
    for (let i = 0; i < isoforms.length; i++) {
        if (isoforms[i].is_canonical) return i
    }

    throw new Error('canonical isoform id error')
}
