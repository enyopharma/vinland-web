import fetch from 'cross-fetch'

import { Query, QueryResult, QueryResultStatuses } from 'search/state/query'

const interactions: Record<string, QueryResult> = {}

export const api = {
    search: (query: Query): QueryResult => {
        if (interactions[query.key]) return interactions[query.key]

        throw new Promise(resolve => {
            setTimeout(() => fetchInteractions(query)
                .then(result => interactions[query.key] = result)
                .then(resolve), 500)
        })
    }
}

const fetchInteractions = async (query: Query) => {
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
