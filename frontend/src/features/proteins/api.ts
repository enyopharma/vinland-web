import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'utils/cache'

import { Protein } from './types'

const limit = 20

const proteins = cache<Protein[]>()

export const resources = {
    proteins: (type: string, query: string) => {
        if (type.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return proteins.resource(`${type}:${query}`, () => fetchProteins(type, query), 300)
    }
}

const fetchProteins = async (type: string, query: string) => {
    const querystr = qs.encode({ type: type, query: query, limit: limit })
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/proteins?${querystr}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }

    return []
}
