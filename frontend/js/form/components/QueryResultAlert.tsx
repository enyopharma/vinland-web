import React from 'react'

import { QueryResult, QueryResultStatuses } from 'form/api/interactions'

type Props = {
    result: QueryResult
}

export const QueryResultAlert: React.FC<Props> = ({ result }) => {
    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return (
                <div className="alert alert-info">
                    Not enough information to query vinland.
                </div>
            )
        case QueryResultStatuses.FAILURE:
            return (
                <div className="alert alert-danger">
                    <ul>
                        {result.data.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            )
        case QueryResultStatuses.SUCCESS:
            return (
                <div className="alert alert-success">
                    {result.data.length} interactions found.
                </div>
            )
        default:
            return null
    }
}
