import { Query, Interaction } from 'form/types'

export type QueryResult =
    | IncompleteQueryResult
    | SuccessfulQueryResult
    | FailedQueryResult

export enum QueryResultStatuses {
    INCOMPLETE = 'incomplete',
    SUCCESS = 'success',
    FAILURE = 'failure',
}

interface IncompleteQueryResult {
    status: typeof QueryResultStatuses.INCOMPLETE
}

interface SuccessfulQueryResult {
    status: typeof QueryResultStatuses.SUCCESS
    data: Interaction[]
}

interface FailedQueryResult {
    status: typeof QueryResultStatuses.FAILURE
    data: string[]
}

export function isSuccessful(result: QueryResult): result is SuccessfulQueryResult {
    return result.status == QueryResultStatuses.SUCCESS
}

export const interactions = (query: Query): Promise<QueryResult> => {
    return new Promise(async resolve => {
        const response = await fetch('/interactions', {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            }
        })

        try {
            resolve(await response.json())
        }

        catch {
            resolve({
                status: QueryResultStatuses.FAILURE,
                data: ['server error'],
            })
        }
    })
}
