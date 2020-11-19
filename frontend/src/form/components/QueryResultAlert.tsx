import React, { useEffect } from 'react'

import { toast } from '../toast'

import { QueryResult, QueryResultStatuses } from '../types'

type QueryResultAlertProps = {
    result: QueryResult
}

export const QueryResultAlert: React.FC<QueryResultAlertProps> = ({ result }) => {
    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return <AlertIncomplete />
        case QueryResultStatuses.FAILURE:
            return <AlertFailure errors={result.errors} />
        case QueryResultStatuses.SUCCESS:
            return <AlertSuccess nb={result.interactions.length} />
    }
}

const AlertIncomplete: React.FC = () => (
    <div className="alert alert-info">
        Not enough information to query vinland.
    </div>
)

type AlertFailureProps = {
    errors: string[]
}

const AlertFailure: React.FC<AlertFailureProps> = ({ errors }) => {
    useEffect(() => { toast('invalid query', { type: toast.TYPE.ERROR }) }, [errors])

    return (
        <div className="alert alert-danger">
            <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
        </div>
    )
}

type AlertSuccessProps = {
    nb: number
}

const AlertSuccess: React.FC<AlertSuccessProps> = ({ nb }) => {
    const message = `${nb} ${nb > 1 ? 'interactions' : 'interaction'} found.`

    useEffect(() => { toast(message, { type: toast.TYPE.SUCCESS }) }, [message])

    return <div className="alert alert-success">{message}</div>
}
