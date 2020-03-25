import React from 'react'

import { Query } from 'features/query'
import { resources } from 'features/query'

const QueryResultSection = React.lazy(() => import('./QueryResultSection').then(module => ({ default: module.QueryResultSection })))

type Props = {
    query: Query
}

export const QueryResultSectionSuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<Fallback />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return <QueryResultSection result={result} />
}

const Fallback: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: '100%' }}
        ></div>
    </div>
)
