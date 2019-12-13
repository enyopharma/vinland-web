import md5 from 'md5'
import { SearchState } from './search'
import { Interaction } from './interaction'
import { parse as parseIdentifiers } from './identifier'

/**
 * types.
 */
export type Query = {
    key: string
    identifiers: string[]
    taxon: {
        left: number
        right: number
    }
    names: string[]
    hh: boolean
    network: boolean
    vh: boolean
    publications: number
    methods: number
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

export type IncompleteQueryResult = {
    status: typeof QueryResultStatuses.INCOMPLETE
}

export type SuccessfulQueryResult = {
    status: typeof QueryResultStatuses.SUCCESS
    interactions: Interaction[]
}

export type FailedQueryResult = {
    status: typeof QueryResultStatuses.FAILURE
    errors: string[]
}

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}

/**
 * misc.
 */
export const state2Query = (state: SearchState) => {
    const identifiers = parseIdentifiers(state.identifiers)

    const parts: string[] = []
    if (state.options.hh.show) parts.push('HH')
    if (state.options.vh.show) parts.push('VH')
    if (state.options.hh.network) parts.push('NETWORK')
    parts.push(state.options.publications.toString())
    parts.push(state.options.methods.toString())
    parts.push(state.taxon.left.toString())
    parts.push(state.taxon.right.toString())
    parts.push(...state.names.sort((a, b) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a, b) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        taxon: {
            left: state.taxon.left,
            right: state.taxon.right,
        },
        names: state.names,
        hh: state.options.hh.show,
        vh: state.options.vh.show,
        network: state.options.hh.network,
        publications: state.options.publications,
        methods: state.options.methods,
    }
}
