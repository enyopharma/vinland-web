import { SuccessfulQueryResult, Protein, Interaction, Network } from './types'
import { network } from './network'

export const cache = (result: SuccessfulQueryResult) => {
    return {
        interactions: result.interactions,
        proteins: getProteinCache(result.interactions),
        network: getNetworkCache(result.interactions),
    }
}

const proteins = (interactions: Interaction[]) => {
    const proteins: Record<string, Protein> = {}

    interactions.forEach(i => {
        proteins[`${i.protein1.accession}:${i.protein1.name}`] = i.protein1
        proteins[`${i.protein2.accession}:${i.protein2.name}`] = i.protein2
    })

    return Object.values(proteins)
}

const getProteinCache = (interactions: Interaction[]) => {
    let cache: Protein[] | null = null

    return () => {
        if (cache === null) {
            throw new Promise<Protein[]>(resolve => resolve(proteins(interactions))).then(proteins => cache = proteins)
        }

        return cache
    }
}

const getNetworkCache = (interactions: Interaction[]) => {
    let cache: Network | null = null

    return () => {
        if (cache === null) {
            throw new Promise<Network>(resolve => resolve(network(interactions))).then(network => cache = network)
        }

        return cache
    }
}
