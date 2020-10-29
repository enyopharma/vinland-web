import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { SearchResult } from 'app/types'

import { Annotation, Taxon, Name, RelatedTaxa, Query, QueryResult, QueryResultStatuses } from './types'

const annotations = cache<SearchResult<Annotation>[]>()
const taxa = cache<SearchResult<Taxon>[]>()
const names = cache<Name[]>()
const related = cache<RelatedTaxa>()
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

    names: (ncbi_taxon_id: number) => {
        if (ncbi_taxon_id < 1) return { read: () => [] }

        return names.resource(ncbi_taxon_id, () => fetchNames(ncbi_taxon_id))
    },

    related: (ncbi_taxon_id: number) => {
        if (ncbi_taxon_id < 1) return { read: () => ({ parent: null, children: [] }) }

        return related.resource(ncbi_taxon_id, () => fetchRelated(ncbi_taxon_id))
    },

    result: (query: Query) => {
        return result.resource(query.key, () => fetchResult(query), 300)
    },
}

const fetchAnnotations = async (source: string, query: string) => {
    const querystr = qs.encode({ source, query, limit: 5 })
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

const fetchTaxa = async (query: string) => {
    const querystr = qs.encode({ query, limit: 5 })
    const params = { headers: { 'accept': 'application/json' } }

    try {
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

    catch (error) {
        console.log(error)
    }

    return []
}

const fetchNames = async (ncbi_taxon_id: number) => {
    const params = { headers: { 'accept': 'application/json' } }

    try {
        const response = await fetch(`/api/taxa/${ncbi_taxon_id}/names`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data.names
    }

    catch (error) {
        console.log(error)
    }

    return []
}

const fetchRelated = async (ncbi_taxon_id: number) => {
    const params = { headers: { 'accept': 'application/json' } }

    try {
        const response = await fetch(`/api/taxa/${ncbi_taxon_id}/related`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }

    return { parent: null, children: [] }
}

const fetchResult = async (query: Query) => {
    const params = {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        }
    }

    try {
        const response = await fetch(`/api/interactions`, params)
        const json = await response.json()

        if (!json.status && json.errors) {
            return { status: QueryResultStatuses.FAILURE, errors: json.errors }
        }

        switch (json.status) {
            case QueryResultStatuses.INCOMPLETE:
                return { status: json.status }
            case QueryResultStatuses.FAILURE:
                return { status: json.status, errors: json.errors }
            case QueryResultStatuses.SUCCESS:
                return { status: json.status, interactions: json.data }
            default:
                throw new Error(json)
        }
    }

    catch (error) {
        console.log(error)
    }

    return { status: QueryResultStatuses.FAILURE, errors: ['Something went wrong'] }
}
