import qs from 'querystring'
import fetch from 'cross-fetch'

import { SearchResult } from 'app/state'
import { Taxon } from 'search/features/taxonomy'

const limit = 5
const taxa: Record<string, SearchResult<Taxon>[]> = {}

export const cache = {
    read: (query: string) => {
        if (taxa[query]) return taxa[query]

        throw new Promise(resolve => {
            setTimeout(() => fetchTaxa(query)
                .then(results => taxa[query] = results)
                .then(resolve), 300)
        })
    }
}

const fetchTaxa = async (query: string) => {
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
