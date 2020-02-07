import React, { Suspense, useState, useEffect } from 'react'

import { Interaction, Query, QueryResult, QueryResultStatuses } from 'features/query'

import { toast } from 'features/toast'
import { resources } from 'features/query'

import { InteractionTable } from './InteractionTable'
import { QueryResultPagination } from './QueryResultPagination'

const limit = 20

type Props = {
    query: Query
}

type SwitchProps = {
    result: QueryResult
}

type FailureProps = {
    errors: string[]
}

type SuccessProps = {
    interactions: Interaction[]
}

export const QueryResultCard: React.FC<Props> = ({ query }) => (
    <Suspense fallback={<CardProgressBar />}>
        <CardFetcher query={query} />
    </Suspense>
)

const CardFetcher: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return <CardSwitch result={result} />
}

const CardProgressBar: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <div className="progress">
                <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    style={{ width: '100%' }}
                ></div>
            </div>
        </div>
    </div>
)

const CardSwitch: React.FC<SwitchProps> = ({ result }) => {
    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return <CardIncomplete />
        case QueryResultStatuses.FAILURE:
            return <CardFailure errors={result.errors} />
        case QueryResultStatuses.SUCCESS:
            return <CardSuccess interactions={result.interactions} />
    }
}

const CardIncomplete: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <div className="alert alert-info">
                Not enough information to query vinland.
            </div>
        </div>
    </div>
)

const CardFailure: React.FC<FailureProps> = ({ errors }) => {
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

const CardSuccess: React.FC<SuccessProps> = ({ interactions }) => {
    return interactions.length === 0
        ? <CardSuccessWithNoInteraction />
        : <CardSuccessWithInteractions interactions={interactions} />
}

const CardSuccessWithNoInteraction: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <div className="alert alert-success">
                No interaction found.
            </div>
        </div>
    </div>
)

const CardSuccessWithInteractions: React.FC<SuccessProps> = ({ interactions }) => {
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
            <InteractionTable interactions={interactions.slice(offset, offset + limit)} limit={limit} />
            <div className="card-body">
                <QueryResultPagination offset={offset} limit={limit} total={interactions.length} update={setOffset} />
            </div>
        </div>
    )
}
