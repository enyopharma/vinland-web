import React, { useState, useEffect } from 'react'

import { Query } from 'form/types'

import * as api from 'form/api/interactions'
import { QueryResult, QueryResultStatuses } from 'form/api/interactions'

import { PaginationRange } from './PaginationRange'
import { QueryResultAlert } from './QueryResultAlert'
import { InteractionTHead } from './InteractionTHead'
import { InteractionTBody } from './InteractionTBody'

type Props = {
    query: Query
    limit: number
}

const init: QueryResult = { status: QueryResultStatuses.INCOMPLETE }

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

export const QueryResultCard: React.FC<Props> = React.memo(({ query, limit }) => {
    const [offset, setOffset] = useState<number>(0)
    const [fetching, setFetching] = useState<boolean>(false)
    const [result, setResult] = useState<QueryResult>(init)

    useEffect(() => {
        if (isQueryComplete(query)) {
            setFetching(true)

            const timeout = setTimeout(() => {
                api.interactions(query).then(result => setResult(result))
            }, 500)

            return () => clearTimeout(timeout)
        }

        setResult(init)
    }, [query])

    useEffect(() => { setFetching(false) }, [result])

    if (fetching) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="progress">
                        <div
                            style={{ width: '100%' }}
                            className="progress-bar progress-bar-striped progress-bar-animated"
                        ></div>
                    </div>
                </div>
            </div>
        )
    }

    if (api.isSuccessful(result) && result.data.length > 0) {
        return (
            <div className="card">
                <div className="card-body">
                    <QueryResultAlert result={result} />
                    <PaginationRange offset={offset} total={result.data.length} limit={limit} update={setOffset} />
                </div>
                <table className="table card-table table-striped table-hover">
                    <InteractionTHead />
                    <InteractionTBody interactions={result.data.slice(offset, offset + limit)} />
                </table>
                <div className="card-body">
                    <PaginationRange offset={offset} total={result.data.length} limit={limit} update={setOffset} />
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="card-body">
                <QueryResultAlert result={result} />
            </div>
        </div>
    )
}, arePropsEqual)
