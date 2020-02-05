import md5 from 'md5'
import { SearchState } from 'search/state'
import { parse as parseIdentifiers } from './identifiers'

/**
 * types.
 */
export type Query = {
    readonly key: string
    readonly identifiers: string[]
    readonly ncbi_taxon_id: number
    readonly names: string[]
    readonly hh: boolean
    readonly vh: boolean
    readonly neighbors: boolean
    readonly publications: number
    readonly methods: number
}

export type QueryResult =
    | IncompleteQueryResult
    | SuccessfulQueryResult
    | FailedQueryResult

export enum QueryResultStatuses {
    INCOMPLETE = 'incomplete',
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export interface IncompleteQueryResult {
    readonly status: typeof QueryResultStatuses.INCOMPLETE
}

export interface SuccessfulQueryResult {
    readonly status: typeof QueryResultStatuses.SUCCESS
    readonly interactions: Interaction[]
}

export interface FailedQueryResult {
    readonly status: typeof QueryResultStatuses.FAILURE
    readonly errors: string[]
}

export type Interaction = {
    readonly type: 'hh' | 'vh'
    readonly protein1: Interactor
    readonly protein2: Interactor
    readonly publications: { nb: number }
    readonly methods: { nb: number }
}

export type Interactor = {
    readonly type: 'h' | 'v'
    readonly accession: string
    readonly name: string
    readonly description: string
    readonly taxon: {
        readonly ncbi_taxon_id: number
        readonly name: string
    }
    readonly species: {
        readonly ncbi_taxon_id: number
        readonly name: string
    }
}

/**
 * utils.
 */
export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}

export const state2Query = (search: SearchState) => {
    const identifiers = parseIdentifiers(search.identifiers)
    const ncbi_taxon_id = search.taxonomy.taxon === null ? 0 : search.taxonomy.taxon.ncbi_taxon_id

    const parts: string[] = []
    if (search.options.hh) parts.push('HH')
    if (search.options.vh) parts.push('VH')
    if (search.options.neighbors) parts.push('NEIGHBORS')
    parts.push(search.options.publications.toString())
    parts.push(search.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...search.taxonomy.names.sort((a, b) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a: string, b: string) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: search.taxonomy.names,
        hh: search.options.hh,
        vh: search.options.vh,
        neighbors: search.options.neighbors,
        publications: search.options.publications,
        methods: search.options.methods,
    }
}
