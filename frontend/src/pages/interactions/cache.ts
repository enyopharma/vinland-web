import { Protein, Interaction, Network } from './types'
import { network } from './network'

export const getProteinCache = (interactions: Interaction[]) => {
    let cache: Protein[] | null = null

    const filter = (interactions: Interaction[]) => {
        const proteins: Record<string, Protein> = {}

        interactions.forEach(i => {
            proteins[`${i.protein1.accession}:${i.protein1.name}`] = i.protein1
            proteins[`${i.protein2.accession}:${i.protein2.name}`] = i.protein2
        })

        return Object.values(proteins)
    }

    return () => {
        if (cache === null) throw new Promise(resolve => setTimeout(() => {
            cache = filter(interactions)
            resolve()
        }, 0))

        return cache
    }
}

export const getNetworkCache = (interactions: Interaction[]) => {
    let cache: Network | null = null

    return () => {
        if (cache === null) throw new Promise(resolve => setTimeout(() => {
            cache = network(interactions)
            resolve()
        }, 0))

        return cache
    }
}
