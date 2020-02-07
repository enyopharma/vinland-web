import fetch from 'cross-fetch'
import { newCache } from 'utils/cache'

import { Query, QueryResult, QueryResultStatuses } from '.'

const result = newCache<QueryResult>()

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
            case QueryResultStatuses.SUCCESS:
                return { status: json.status, interactions: json.data }
            case QueryResultStatuses.FAILURE:
                return { status: json.status, errors: json.errors }
            default:
                throw new Error(json)
        }
    }

    catch (error) {
        console.log(error)
    }

    return { status: QueryResultStatuses.FAILURE, errors: ['Something went wrong'] }
}
