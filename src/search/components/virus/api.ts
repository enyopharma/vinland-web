import qs from 'querystring'
import fetch from 'cross-fetch'

import { SearchResult } from 'search/state/input'
import { Taxon } from 'search/state/virus'

export const newTaxaStore = (limit: number) => {
    const cache: Record<string, SearchResult<Taxon>[]> = {}

    return {
        read: (query: string) => {
            if (cache[query]) return cache[query]

            throw new Promise(resolve => {
                setTimeout(() => fetchTaxa(query, limit)
                    .then(results => cache[query] = results)
                    .then(resolve), 300)
            })
        }
    }
}

const fetchTaxa = async (query: string, limit: number) => {
    const querystr = qs.encode({ query: query, limit: limit })
    const params = { headers: { 'accept': 'application/json' } }

    try {
        const response = await fetch(`/api/taxa?${querystr}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data.map((taxon: Taxon) => ({
            label: taxon.name,
            value: taxon,
        }))
    }

    catch (error) {
        console.log(error)
    }

    return []
}
