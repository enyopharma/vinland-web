import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'utils/cache'

import { Resource, SearchResult, Annotation, Taxon, Name, RelatedTaxa, Query, QueryResult, QueryResultStatuses } from './types'

const annotations = cache<SearchResult<Annotation>[]>()
const taxa = cache<SearchResult<Taxon>[]>()
const taxon = cache<[RelatedTaxa, Name[]]>()
const result = cache<QueryResult>()

export const resources = {
    annotations: (source: string, query: string) => {
        if (source.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return annotations.resource(`${source}:${query}`, () => fetchAnnotations(source, query), 300)
    },

    taxa: (query: string) => {
        if (query.trim().length === 0) return { read: () => [] }

        return taxa.resource(query, () => fetchTaxa(query), 300)
    },

    taxon: (ncbi_taxon_id: number) => {
        if (ncbi_taxon_id < 1) {
            return { read: () => [{ parent: null, children: [] }, []] } as Resource<[RelatedTaxa, Name[]]>
        }

        return taxon.resource(ncbi_taxon_id, async () => {
            const related = await fetchRelated(ncbi_taxon_id)
            const names = await fetchNames(ncbi_taxon_id)

            return [related, names]
        })
    },

    result: (query: Query) => {
        return result.resource(query.key, () => fetchResult(query), 300)
    },
}

const fetchAnnotations = async (source: string, query: string): Promise<SearchResult<Annotation>[]> => {
    const querystr = qs.encode({ source, query, limit: 5 })
    const params = { headers: { accept: 'application/json' } }

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

const fetchTaxa = async (query: string): Promise<SearchResult<Taxon>[]> => {
    const querystr = qs.encode({ query, limit: 5 })
    const params = { headers: { 'accept': 'application/json' } }

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

const fetchNames = async (ncbi_taxon_id: number): Promise<Name[]> => {
    const params = { headers: { 'accept': 'application/json' } }

    const response = await fetch(`/api/taxa/${ncbi_taxon_id}/names`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data.names
}

const fetchRelated = async (ncbi_taxon_id: number): Promise<RelatedTaxa> => {
    const params = { headers: { 'accept': 'application/json' } }

    const response = await fetch(`/api/taxa/${ncbi_taxon_id}/related`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}

const fetchResult = async (query: Query): Promise<QueryResult> => {
    const params = {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        }
    }

    const response = await fetch(`/api/interactions`, params)
    const json = await response.json()

    switch (json.status) {
        case QueryResultStatuses.INCOMPLETE:
            return { status: json.status }
        case QueryResultStatuses.FAILURE:
            return { status: json.status, errors: json.errors }
        case QueryResultStatuses.SUCCESS:
            return { status: json.status, interactions: json.data }
        default:
            return { status: QueryResultStatuses.FAILURE, errors: ['Something went wrong'] }
    }
}
