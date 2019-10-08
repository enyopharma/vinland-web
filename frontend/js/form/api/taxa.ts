import qs from 'querystring'

import { Taxon } from 'form/types'
import { SearchResult } from 'form/types'

export const taxa = (query: string, limit: number): Promise<SearchResult<Taxon>> => {
    return new Promise(async resolve => {
        const querystr = qs.encode({ query: query, limit: limit })

        const response = await fetch(`/taxa?${querystr}`, {
            headers: {
                'accept': 'application/json',
            },
        })

        try {
            const json = await response.json()

            resolve({
                query: query,
                limit: limit,
                hints: json.data.map(taxon => ({
                    label: taxon.name,
                    value: taxon,
                })),
            })
        }

        catch (error) {
            console.log(error)

            resolve({
                query: query,
                limit: limit,
                hints: [],
            })
        }
    })
}
