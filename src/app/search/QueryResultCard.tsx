import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { QueryResult, QueryResultStatuses, Interaction } from './src/interaction'

import { QueryResultRange } from './QueryResultRange'
import { InteractionTHead } from './InteractionTHead'
import { InteractionTBody } from './InteractionTBody'

type Props = {
    result: QueryResult
}

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
    const limit = 10
    const total = interactions.length

    const message = `${total} ${total > 1 ? 'interactions' : 'interaction'} found.`

    useEffect(() => { toast(message, { type: toast.TYPE.SUCCESS }) }, [message])

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-success">
                    {message}
                </div>
            </div>
            <div className="card-body">
                <QueryResultRange offset={offset} limit={limit} total={total} update={setOffset} />
            </div>
            <table className="table card-table table-hover table-striped">
                <InteractionTHead />
                <InteractionTBody interactions={interactions.slice(offset, offset + limit)} />
            </table>
            <div className="card-body">
                <QueryResultRange offset={offset} limit={limit} total={total} update={setOffset} />
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
