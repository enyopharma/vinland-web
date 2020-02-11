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
    readonly protein1: Protein
    readonly protein2: Protein
    readonly publications: { nb: number }
    readonly methods: { nb: number }
}

export type Protein = {
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

export * from './api'
export * from './components/QueryResultSection'
export * from './utils'
