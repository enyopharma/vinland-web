import { SuccessfulQueryResult, Protein, Interaction, Network } from './types'
import { network } from './network'

export const wrapper = (result: SuccessfulQueryResult) => {
    return {
        interactions: result.interactions,
        proteins: {
            human: getProteinCache('h', result),
            virus: getProteinCache('v', result),
        },
        network: getNetworkCache(result),
    }
}

const filter = (type: Protein['type'], interactions: Interaction[]) => {
    const map: Record<string, Protein> = {}
    interactions.forEach(i => {
        if (i.protein1.type === type) map[`${i.protein1.accession}:${i.protein1.name}`] = i.protein1
        if (i.protein2.type === type) map[`${i.protein2.accession}:${i.protein2.name}`] = i.protein2
    })
    return Object.values(map)
}

const getProteinCache = (type: Protein['type'], result: SuccessfulQueryResult) => {
    let cache: Protein[] | null = null

    return () => {
        if (cache === null) throw new Promise(resolve => setTimeout(() => {
            cache = filter(type, result.interactions)
            resolve()
        }, 0))

        return cache
    }
}

const getNetworkCache = (result: SuccessfulQueryResult) => {
    let cache: Network | null = null

    return () => {
        if (cache === null) throw new Promise(resolve => setTimeout(() => {
            cache = network(result.interactions)
            resolve()
        }, 0))

        return cache
    }
}
