import qs from 'querystring'
import fetch from 'cross-fetch'
import { SearchResult } from './shared'

/**
 * types.
 */
export type Annotation = {
    source: string,
    ref: string
    name: string
    accessions: string[]
}

/**
 * api.
 */
export const read = (limit: number) => {
    const cache: Record<string, SearchResult<Annotation>[]> = {}

    return (source: string, query: string) => {
        if (source.trim().length === 0) return []
        if (query.trim().length === 0) return []

        const key = `${source}:${query}`

        if (cache[key]) return cache[key]

        throw new Promise(resolve => {
            setTimeout(() => getAnnotations(source, query, limit)
                .then(results => cache[key] = results)
                .then(resolve), 300)
        })
    }
}

const getAnnotations = async (source: string, query: string, limit: number) => {
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
