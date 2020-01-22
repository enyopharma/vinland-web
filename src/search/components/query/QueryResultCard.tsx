import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { Interaction } from 'search/state/interaction'
import { QueryResult, QueryResultStatuses } from 'search/state/query'
import { InteractionThead } from 'search/components/interaction/InteractionThead'
import { InteractionTbody } from 'search/components/interaction/InteractionTbody'

import { QueryResultPagination } from './QueryResultPagination'

type Props = {
    result: QueryResult
}

const limit = 20

const QueryResultIncomplete: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <div className="alert alert-info">
                Not enough information to query vinland.
            </div>
        </div>
    </div>
)

const QueryResultFailure: React.FC<{ errors: string[] }> = ({ errors }) => {
    useEffect(() => { toast('invalid query', { type: toast.TYPE.ERROR }) }, [errors])

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-danger">
                    <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
                </div>
            </div>
        </div>
    )
}

const QueryResultSuccess: React.FC<{ interactions: Interaction[] }> = ({ interactions }) => {
    return interactions.length === 0
        ? <QueryResultSuccessWithNoInteraction />
        : <QueryResultSuccessWithInteractions interactions={interactions} />
}

const QueryResultSuccessWithNoInteraction: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <div className="alert alert-success">
                No interaction found.
            </div>
        </div>
    </div>
)

const QueryResultSuccessWithInteractions: React.FC<{ interactions: Interaction[] }> = ({ interactions }) => {
    const [offset, setOffset] = useState<number>(0)

    const message = `${interactions.length} ${interactions.length > 1 ? 'interactions' : 'interaction'} found.`

    useEffect(() => { setOffset(0) }, [interactions])
    useEffect(() => { toast(message, { type: toast.TYPE.SUCCESS }) }, [message])

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-success">{message}</div>
                <QueryResultPagination offset={offset} limit={limit} total={interactions.length} update={setOffset} />
            </div>
            <table className="table card-table table-hover table-striped">
                <InteractionThead />
                <InteractionTbody interactions={interactions.slice(offset, offset + limit)} limit={limit} />
            </table>
            <div className="card-body">
                <QueryResultPagination offset={offset} limit={limit} total={interactions.length} update={setOffset} />
            </div>
        </div>
    )
}

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return <QueryResultIncomplete />
        case QueryResultStatuses.FAILURE:
            return <QueryResultFailure errors={result.errors} />
        case QueryResultStatuses.SUCCESS:
            return <QueryResultSuccess interactions={result.interactions} />
    }
}
