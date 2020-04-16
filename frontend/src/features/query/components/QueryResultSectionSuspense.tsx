import React from 'react'

import { Query } from 'features/query'
import { resources } from 'features/query'
import { ProgressBar } from 'pages/partials'

const QueryResultSection = React.lazy(() => import('./QueryResultSection').then(module => ({ default: module.QueryResultSection })))

type Props = {
    query: Query
}

export const QueryResultSectionSuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<ProgressBar />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return <QueryResultSection result={result} />
}
