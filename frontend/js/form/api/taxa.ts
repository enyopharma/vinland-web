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

export const taxa = (q: string): Promise<QueryResult> => {
    return new Promise(async resolve => {
        if (q.trim().length == 0) {
            resolve({ status: QueryResultStatuses.SUCCESS, data: [] })
            return
        }

        const query = qs.encode({ q: q })

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
