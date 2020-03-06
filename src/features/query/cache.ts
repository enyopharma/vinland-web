import { SuccessfulQueryResult, Protein, Interaction, Network } from './types'
import { network } from './network'

export const cache = (result: SuccessfulQueryResult) => {
    return {
        interactions: result.interactions,
        proteins: getProteinCache(result.interactions),
        network: getNetworkCache(result.interactions),
    }
}

const getProteinCache = (interactions: Interaction[]) => {
    let cache: { human: Protein[], viral: Protein[] } | null = null

    const filter = (interactions: Interaction[]) => {
        const human: Record<string, Protein> = {}
        const viral: Record<string, Protein> = {}

        interactions.forEach(i => {
            i.protein1.type === 'h'
                ? human[`${i.protein1.accession}:${i.protein1.name}`] = i.protein1
                : viral[`${i.protein1.accession}:${i.protein1.name}`] = i.protein1

            i.protein2.type === 'h'
                ? human[`${i.protein2.accession}:${i.protein2.name}`] = i.protein2
                : viral[`${i.protein2.accession}:${i.protein2.name}`] = i.protein2
        })

        return {
            human: Object.values(human),
            viral: Object.values(viral).sort((a, b) => {
                return a.name.localeCompare(b.name) || a.taxon.name.localeCompare(b.taxon.name)
            }),
        }
    }

    return () => {
        if (cache === null) throw new Promise(resolve => setTimeout(() => {
            cache = filter(interactions)
            resolve()
        }, 0))

        return cache
    }
}

const getNetworkCache = (interactions: Interaction[]) => {
    let cache: Network | null = null

    return () => {
        if (cache === null) throw new Promise(resolve => setTimeout(() => {
            cache = network(interactions)
            resolve()
        }, 0))

        return cache
    }
}
