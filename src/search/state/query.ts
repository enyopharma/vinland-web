export type Query = {
    readonly key: string
    readonly identifiers: string[]
    readonly taxon: {
        readonly left: number
        readonly right: number
    }
    readonly names: string[]
    readonly hh: boolean
    readonly network: boolean
    readonly vh: boolean
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
    readonly taxon: string
}

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}
