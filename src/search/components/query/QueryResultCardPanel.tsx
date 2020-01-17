import React from 'react'

import { Query } from 'search/state/query'

import { newInteractionStore } from './api'
import { QueryResultCard } from './QueryResultCard'


type Props = {
    query: Query,
}

const interactions = newInteractionStore()

const QueryResultLoader: React.FC = () => (
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

const QueryResultFetcher: React.FC<Props> = ({ query }) => {
    const result = interactions.read(query)

    return <QueryResultCard result={result} />
}

export const QueryResultCardPanel: React.FC<Props> = ({ query }) => (
    <React.Suspense fallback={<QueryResultLoader />}>
        <QueryResultFetcher query={query} />
    </React.Suspense>
)
