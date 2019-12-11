import qs from 'querystring'
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

    return (source: string, query: string): SearchResult<Annotation>[] => {
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

const getAnnotations = async (source: string, query: string, limit: number): Promise<SearchResult<Annotation>[]> => {
    const host = process.env.REACT_APP_API_HOST || 'http://localhost'
    const querystr = qs.encode({ source: source, query: query, limit: limit })
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`${host}/annotations?${querystr}`, params)
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
