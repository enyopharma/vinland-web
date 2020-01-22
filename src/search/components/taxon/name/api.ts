import fetch from 'cross-fetch'

import { Name } from 'search/state/name'

const names: Record<number, Name[]> = {}

export const api = {
    read: (ncbi_taxon_id: number) => {
        if (names[ncbi_taxon_id]) return names[ncbi_taxon_id]

        throw new Promise(resolve => {
            setTimeout(() => fetchNames(ncbi_taxon_id)
                .then(results => names[ncbi_taxon_id] = results)
                .then(resolve), 300)
        })
    }
}

const fetchNames = async (ncbi_taxon_id: number) => {
    const params = { headers: { 'accept': 'application/json' } }

    const response = await fetch(`/api/taxa/${ncbi_taxon_id}/names`, params)
    const json = await response.json()

    if (json.success) {
        return json.data
    }

    throw new Error(json)
}
