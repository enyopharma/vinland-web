import qs from 'querystring'
import fetch from 'cross-fetch'

import { Taxon, Name } from '.'
import { SearchResult } from 'features/autocomplete'

const limit = 5
const taxa: Record<string, SearchResult<Taxon>[]> = {}
const names: Record<number, Name[]> = {}
const related: Record<number, { parent: Taxon | null, children: Taxon[] }> = {}

export const cache = {
    read: (query: string) => {
        if (taxa[query]) return taxa[query]

        throw new Promise(resolve => {
            setTimeout(() => fetchTaxa(query)
                .then(results => taxa[query] = results)
                .then(resolve), 300)
        })
    },
    names: (ncbi_taxon_id: number) => {
        if (names[ncbi_taxon_id]) return names[ncbi_taxon_id]

        throw new Promise(resolve => {
            setTimeout(() => fetchNames(ncbi_taxon_id)
                .then(results => names[ncbi_taxon_id] = results)
                .then(resolve), 300)
        })
    },
    related: (ncbi_taxon_id: number) => {
        if (related[ncbi_taxon_id]) return related[ncbi_taxon_id]

        throw new Promise(resolve => {
            setTimeout(() => fetchRelated(ncbi_taxon_id)
                .then(results => related[ncbi_taxon_id] = results)
                .then(resolve), 300)
        })
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

    const response = await fetch(`/api/taxa/${ncbi_taxon_id}/names`, params)
    const json = await response.json()

    if (json.success) {
        return json.data.names
    }

    throw new Error(json)
}

const fetchRelated = async (ncbi_taxon_id: number) => {
    const params = { headers: { 'accept': 'application/json' } }

    const response = await fetch(`/api/taxa/${ncbi_taxon_id}/related`, params)
    const json = await response.json()

    if (json.success) {
        return json.data
    }

    throw new Error(json)
}
