import fetch from 'cross-fetch'

import { Taxon } from 'search/state/taxon'

const related: Record<number, { parent: Taxon | null, children: Taxon[] }> = {}

export const api = {
    read: (ncbi_taxon_id: number) => {
        if (related[ncbi_taxon_id]) return related[ncbi_taxon_id]

        throw new Promise(resolve => {
            setTimeout(() => fetchRelated(ncbi_taxon_id)
                .then(results => related[ncbi_taxon_id] = results)
                .then(resolve), 300)
        })
    }
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
