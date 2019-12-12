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

export type Interaction = {
    type: 'hh' | 'vh'
    protein1: Interactor
    protein2: Interactor
    publications: { nb: number }
    methods: { nb: number }
}

export type Interactor = {
    type: 'h' | 'v'
    accession: string
    name: string
    description: string
    taxon: string
}

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}

/**
 * api.
 */
export const read = () => {
    const cache: Record<string, QueryResult> = {}

    return (query: Query): QueryResult => {
        if (cache[query.key]) return cache[query.key]

        throw new Promise(resolve => {
            setTimeout(() => getInteractions(query)
                .then(result => cache[query.key] = result)
                .then(resolve), 500)
        })
    }
}

const getInteractions = async (query: Query) => {
    const host = process.env.REACT_APP_API_HOST || 'http://localhost'
    const params = {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        }
    }

    try {
        const response = await fetch(`${host}/interactions`, params)
        const json = await response.json()

        switch (json.status) {
            case QueryResultStatuses.INCOMPLETE:
                return { status: json.status }
            case QueryResultStatuses.SUCCESS:
                return { status: json.status, interactions: json.data }
            case QueryResultStatuses.FAILURE:
                return { status: json.status, errors: json.data }
            default:
                throw new Error(json)
        }
    }

    catch (error) {
        console.log(error)
    }

    return { status: QueryResultStatuses.FAILURE, errors: ['Something went wrong'] }
}
