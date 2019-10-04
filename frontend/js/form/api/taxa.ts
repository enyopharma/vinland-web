import qs from 'querystring'

import { Taxon } from 'form/types'

export type QueryResult =
    | SuccessfulQueryResult
    | FailedQueryResult

export enum QueryResultStatuses {
    SUCCESS = 'success',
    FAILURE = 'failure',
}

interface SuccessfulQueryResult {
    status: QueryResultStatuses.SUCCESS
    data: Taxon[]
}

interface FailedQueryResult {
    status: QueryResultStatuses.FAILURE
    data: string[]
}

export function isSuccessful(result: QueryResult): result is SuccessfulQueryResult {
    return result.status == QueryResultStatuses.SUCCESS
}

export const taxa = (q: string, limit: number): Promise<QueryResult> => {
    return new Promise(async resolve => {
        const query = qs.encode({ q: q, limit: limit })

        const response = await fetch(`/taxa?${query}`, {
            headers: {
                'accept': 'application/json',
            },
        })

        try {
            const json = await response.json()

            resolve({
                status: QueryResultStatuses.SUCCESS,
                data: json.data,
            })
        }

        catch {
            resolve({
                status: QueryResultStatuses.FAILURE,
                data: ['server error']
            })
        }
    })
}
