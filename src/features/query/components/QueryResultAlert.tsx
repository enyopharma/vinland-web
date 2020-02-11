import React, { useEffect } from 'react'

import { QueryResultStatuses, QueryResult } from 'features/query'

import { toast } from 'features/toast'

type Props = {
    result: QueryResult
}

type FailureProps = {
    errors: string[]
}

type SuccessProps = {
    nb: number
}

export const QueryResultAlert: React.FC<Props> = ({ result }) => {
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

const AlertFailure: React.FC<FailureProps> = ({ errors }) => {
    useEffect(() => { toast('invalid query', { type: toast.TYPE.ERROR }) }, [errors])

    return (
        <div className="alert alert-danger">
            <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
        </div>
    )
}

const AlertSuccess: React.FC<SuccessProps> = ({ nb }) => {
    const message = `${nb} ${nb > 1 ? 'interactions' : 'interaction'} found.`

    useEffect(() => { toast(message, { type: toast.TYPE.SUCCESS }) }, [message])

    return <div className="alert alert-success">{message}</div>
}
