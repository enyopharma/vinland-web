import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { SearchResult } from 'app/types'

import { Taxon, RelatedTaxa, Name } from './types'

const limit = 5

const taxa = cache<SearchResult<Taxon>[]>()
const names = cache<Name[]>()
const related = cache<RelatedTaxa>()

export const resources = {
    taxa: (query: string) => {
        if (query.trim().length === 0) return { read: () => [] }

        return taxa.resource(query, () => fetchTaxa(query), 300)
    },
    names: (ncbi_taxon_id: number) => {
        if (ncbi_taxon_id < 1) return { read: () => [] }

        return names.resource(ncbi_taxon_id, () => fetchNames(ncbi_taxon_id))
    },
    related: (ncbi_taxon_id: number) => {
        if (ncbi_taxon_id < 1) return { read: () => ({ parent: null, children: [] }) }

        return related.resource(ncbi_taxon_id, () => fetchRelated(ncbi_taxon_id))
    },
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

const fetchNames = async (ncbi_taxon_id: number) => {
    const params = { headers: { 'accept': 'application/json' } }

    try {
        const response = await fetch(`/api/taxa/${ncbi_taxon_id}/names`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data.names
    }

    catch (error) {
        console.log(error)
    }

    return []
}

const fetchRelated = async (ncbi_taxon_id: number) => {
    const params = { headers: { 'accept': 'application/json' } }

    try {
        const response = await fetch(`/api/taxa/${ncbi_taxon_id}/related`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }

    return { parent: null, children: [] }
}
