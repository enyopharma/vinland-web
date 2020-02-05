import fetch from 'cross-fetch'

import { Taxon, Name } from 'search/features/taxonomy'

const names: Record<number, Name[]> = {}
const related: Record<number, { parent: Taxon | null, children: Taxon[] }> = {}

export const cache = {
    read: (ncbi_taxon_id: number) => {
        return {
            names: () => {
                if (names[ncbi_taxon_id]) return names[ncbi_taxon_id]

                throw new Promise(resolve => {
                    setTimeout(() => fetchNames(ncbi_taxon_id)
                        .then(results => names[ncbi_taxon_id] = results)
                        .then(resolve), 300)
                })
            },
            related: () => {
                if (related[ncbi_taxon_id]) return related[ncbi_taxon_id]

                throw new Promise(resolve => {
                    setTimeout(() => fetchRelated(ncbi_taxon_id)
                        .then(results => related[ncbi_taxon_id] = results)
                        .then(resolve), 300)
                })
            },
        }
    },
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
