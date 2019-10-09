import qs from 'querystring'

import { Annotation } from 'form/types'
import { SearchResult } from 'form/types'

export const annotations = (source: string, query: string, limit: number): Promise<SearchResult<Annotation>> => {
    return new Promise(async resolve => {
        const querystr = qs.encode({ source: source, query: query, limit: limit })

        const response = await fetch(`/annotations?${querystr}`, {
            headers: {
                'accept': 'application/json',
            },
        })

        try {
            const json = await response.json()

            resolve({
                query: query,
                limit: limit,
                hints: json.data.map(annotation => ({
                    label: [annotation.ref, annotation.name].join(' '),
                    value: annotation,
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
