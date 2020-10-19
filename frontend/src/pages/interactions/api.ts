import fetch from 'cross-fetch'
import { cache } from 'app/cache'
import { getProteinCache, getNetworkCache } from './cache'

import { Query, QueryResult, QueryResultStatuses } from './types'

const result = cache<QueryResult>()

export const resources = {
    result: (query: Query) => {
        return result.resource(query.key, () => fetchResult(query), 300)
    }
}

const fetchResult = async (query: Query) => {
    const params = {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        }
    }

    try {
        const response = await fetch(`/api/interactions`, params)
        const json = await response.json()

        if (!json.status && json.errors) {
            return { status: QueryResultStatuses.FAILURE, errors: json.errors }
        }

        switch (json.status) {
            case QueryResultStatuses.INCOMPLETE:
                return { status: json.status }
            case QueryResultStatuses.FAILURE:
                return { status: json.status, errors: json.errors }
            case QueryResultStatuses.SUCCESS:
                return {
                    status: json.status,
                    interactions: json.data,
                    proteins: getProteinCache(json.data),
                    network: getNetworkCache(json.data),
                }
            default:
                throw new Error(json)
        }
    }

    catch (error) {
        console.log(error)
    }

    return { status: QueryResultStatuses.FAILURE, errors: ['Something went wrong'] }
}
