import qs from 'querystring'
import fetch from 'cross-fetch'

import { SearchResult } from 'search/state/input'
import { Annotation } from 'search/state/identifier'

const limit = 5
const annotations: Record<string, SearchResult<Annotation>[]> = {}

export const api = {
    search: (source: string, query: string) => {
        if (source.trim().length === 0) return []
        if (query.trim().length === 0) return []

        const key = `${source}:${query}`

        if (annotations[key]) return annotations[key]

        throw new Promise(resolve => {
            setTimeout(() => fetchAnnotations(source, query)
                .then(results => annotations[key] = results)
                .then(resolve), 300)
        })
    }
}

const fetchAnnotations = async (source: string, query: string) => {
    const querystr = qs.encode({ source: source, query: query, limit: limit })
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/annotations?${querystr}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data.map((annotation: Annotation) => ({
            label: [annotation.ref, annotation.name].join(' '),
            value: annotation,
        }))
    }

    catch (error) {
        console.log(error)
    }

    return []
}
