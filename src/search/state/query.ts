import { Interaction } from 'search/state/interaction'

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

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}
