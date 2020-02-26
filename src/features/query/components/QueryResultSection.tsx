import React, { Suspense } from 'react'

import { Query, QueryResult, isSuccessfulQueryResult } from 'features/query'
import { resources, wrapper } from 'features/query'

import { QueryResultCard } from './QueryResultCard'
import { QueryResultAlert } from './QueryResultAlert'

type Props = {
    query: Query
}

export const QueryResultSection: React.FC<Props> = ({ query }) => (
    <Suspense fallback={<ProgressBar />}>
        <Fetcher query={query} />
    </Suspense>
)

const ProgressBar: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: '100%' }}
        ></div>
    </div>
)

const Fetcher: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return <Section result={result} />
}

const Section: React.FC<{ result: QueryResult }> = ({ result }) => {
    return (
        <section>
            <QueryResultAlert result={result} />
            {isSuccessfulQueryResult(result) && (
                <QueryResultCard result={wrapper(result)} />
            )}
        </section>
    )
}
