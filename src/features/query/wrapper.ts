import { SuccessfulQueryResult, Network } from './types'
import { network } from './network'

export const wrapper = (result: SuccessfulQueryResult) => {
    return {
        interactions: result.interactions,
        network: getNetworkCache(result),
    }
}

const getNetworkCache = (result: SuccessfulQueryResult) => {
    let cache: Network | null = null

    return () => {
        if (cache === null) {
            throw new Promise(resolve => setTimeout(() => {
                cache = network(result.interactions)
                resolve()
            }, 0))
        }

        return cache
    }
}
