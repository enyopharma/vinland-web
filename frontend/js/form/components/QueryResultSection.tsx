import React, { useState, useEffect } from 'react'

import { Query } from 'form/types'

import * as api from 'form/api/interactions'
import { QueryResult, QueryResultStatuses } from 'form/api/interactions'

import { QueryResultAlert } from './QueryResultAlert'
import { InteractionTable } from './InteractionTable'

type Props = {
    query: Query
}

const isQueryComplete = (query: Query): boolean => {
    return query.human.accessions.length > 0
        || (query.virus.left > 0 && query.virus.right > 0)
}

const areListsEqual = (l1: string[], l2: string[]): boolean => {
    return l1.length == l2.length && l1.every(i => l2.includes(i))
}

const arePropsEqual = (prev: Props, next: Props): boolean => {
    return true
        && prev.query.hh.show == next.query.hh.show
        && prev.query.hh.network == next.query.hh.network
        && prev.query.vh.show == next.query.vh.show
        && prev.query.publications.threshold == next.query.publications.threshold
        && prev.query.methods.threshold == next.query.methods.threshold
        && prev.query.virus.left == next.query.virus.left
        && prev.query.virus.right == next.query.virus.right
        && areListsEqual(prev.query.human.accessions, next.query.human.accessions)
        && areListsEqual(prev.query.virus.names, next.query.virus.names)
}

export const QueryResultSection: React.FC<Props> = React.memo(({ query }) => {
    const [fetching, setFetching] = useState<boolean>(false)

    const [result, setResult] = useState<QueryResult>({
        status: QueryResultStatuses.INCOMPLETE
    })

    useEffect(() => {
        if (!isQueryComplete(query)) {
            setResult({ status: QueryResultStatuses.INCOMPLETE })
        }

        const timeout = setTimeout(() => {
            api.interactions(query).then(result => setResult(result))
        }, 500)

        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => { setFetching(true) }, [query])

    useEffect(() => { setFetching(false) }, [result])

    return fetching
        ? (
            <div className="progress">
                <div
                    style={{ width: '100%' }}
                    className="progress-bar progress-bar-striped progress-bar-animated"
                ></div>
            </div>
        ) : (
            <div className="query-result">
                <QueryResultAlert result={result} />
                {api.isSuccessful(result) ? (
                    <InteractionTable interactions={result.data} />
                ) : null}
            </div>
        )
}, arePropsEqual)
