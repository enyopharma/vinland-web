import React from 'react'

import { Query, read } from './src/interaction'

import { QueryResultCard } from './QueryResultCard'

type Props = {
    query: Query,
}

const search = read()

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
    const result = search(query)

    return <QueryResultCard result={result} />
}

export const QueryResultPanel: React.FC<Props> = ({ query }) => (
    <React.Suspense fallback={<QueryResultLoader />}>
        <QueryResultFetcher query={query} />
    </React.Suspense>
)
