import React from 'react'

import { Query } from 'search/state/query'

import { api } from './api'
import { QueryResultCard } from './QueryResultCard'


type Props = {
    query: Query,
}

const QueryResultCardLoader: React.FC = () => (
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

const QueryResultCardFetcher: React.FC<Props> = ({ query }) => {
    const result = api.search(query)

    return <QueryResultCard result={result} />
}

export const QueryResultCardPanel: React.FC<Props> = ({ query }) => (
    <React.Suspense fallback={<QueryResultCardLoader />}>
        <QueryResultCardFetcher query={query} />
    </React.Suspense>
)
