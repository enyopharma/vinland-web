import React from 'react'

import { Query, read } from './src/interaction'

import { QueryResultAlert } from './QueryResultAlert'

type Props = {
    query: Query,
}

const search = read()

const QueryResultLoader: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: '100%' }}
        ></div>
    </div>
)

const QueryResultFragment: React.FC<Props> = ({ query }) => {
    const result = search(query)

    return (
        <React.Fragment>
            <QueryResultAlert result={result} />
        </React.Fragment>
    )
}

export const QueryResultPanel: React.FC<Props> = ({ query }) => {

    return (
        <React.Suspense fallback={<QueryResultLoader />}>
            <QueryResultFragment query={query} />
        </React.Suspense>
    )
}
