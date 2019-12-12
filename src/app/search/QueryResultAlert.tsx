import React from 'react'

import { QueryResult, QueryResultStatuses } from './src/interaction'

type Props = {
    result: QueryResult
}

export const QueryResultAlert: React.FC<Props> = ({ result }) => {
    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return (
                <div className="alert alert-info">
                    No enough information to query vinland.
                </div>
            )
        case QueryResultStatuses.SUCCESS:
            return (
                <div className="alert alert-success">
                    {result.interactions.length} {result.interactions.length > 1 ? 'interactions' : 'interaction'} found.
                </div>
            )
        case QueryResultStatuses.FAILURE:
            return (
                <div className="alert alert-danger">
                    <ul>{result.errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
                </div>
            )
    }
}
