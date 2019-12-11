/**
 * types.
 */
export type Query = {
    human: {
        identifiers: string[]
    }
    virus: {
        left: number
        right: number
        names: string[]
    }
    hh: {
        show: boolean
        network: boolean
    }
    vh: {
        show: boolean
    }
    publications: {
        threshold: number
    }
    methods: {
        threshold: number
    }
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

export enum InteractionTypes {
    HH = 'hh',
    VH = 'vh',
}

export enum InteractorTypes {
    H = 'h',
    V = 'v',
}

export type Interaction = {
    type: InteractionTypes
    protein1: Interactor
    protein2: Interactor
    publications: PublicationsMeta,
    methods: MethodsMeta
}

export type Interactor = {
    type: InteractorTypes
    accession: string
    name: string
    description: string
    taxon: string
}

export type PublicationsMeta = {
    nb: number
}

export type MethodsMeta = {
    nb: number
}

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status == QueryResultStatuses.SUCCESS
}

/**
 * api.
 */
export const read = async (query: Query) => {
    return await getInteractions(query);
}

const getInteractions = async (query: Query): Promise<QueryResult> => {
    const params = {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        }
    }

    try {
        const response = await fetch('/interactions', params)
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

    return {
        status: QueryResultStatuses.FAILURE,
        errors: ['server error'],
    }
}
