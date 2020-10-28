import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { SearchResult } from 'app/types'

import { Annotation } from './types'

const limit = 5

const annotations = cache<SearchResult<Annotation>[]>()

export const resources = {
    annotations: (source: string, query: string) => {
        if (source.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return annotations.resource(`${source}:${query}`, () => fetchAnnotations(source, query), 300)
    }
}

const fetchAnnotations = async (source: string, query: string) => {
    const querystr = qs.encode({ source, query, limit })
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
