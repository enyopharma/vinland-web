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

    return new Promise<Protein[]>(resolve => {
        const add = (i: number) => {
            setTimeout(() => {
                if (i === interactions.length) {
                    resolve(Object.values(proteins))
                } else {
                    let k = 0;
                    for (let j = i; j < interactions.length && k < 100; j++, k++) {
                        proteins[`${interactions[j].protein1.accession}:${interactions[j].protein1.name}`] = interactions[j].protein1
                        proteins[`${interactions[j].protein2.accession}:${interactions[j].protein2.name}`] = interactions[j].protein2
                    }
                    add(i + k)
                }
            })
        }
        add(0)
    })
}

const getProteinCache = (interactions: Interaction[]) => {
    let cache: Protein[] | null = null

    return () => {
        if (cache === null) {
            throw proteins(interactions).then(proteins => cache = proteins)
        }

        return cache
    }
}

const getNetworkCache = (interactions: Interaction[]) => {
    let cache: Network | null = null

    return () => {
        if (cache === null) {
            throw network(interactions).then(network => cache = network)
        }

        return cache
    }
}
