import React, { Suspense } from 'react'

import { Query, QueryResult, isSuccessfulQueryResult, resources } from 'features/query'

import { QueryResultAlert } from './QueryResultAlert'
import { InteractionsCard } from './InteractionsCard'

type FetcherProps = {
    query: Query
}

type SectionProps = {
    result: QueryResult
}

export const QueryResultSection: React.FC<FetcherProps> = ({ query }) => (
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

const Fetcher: React.FC<FetcherProps> = ({ query }) => {
    const result = resources.result(query).read()

    return <Section result={result} />
}

const Section: React.FC<SectionProps> = ({ result }) => {
    return (
        <section>
            <QueryResultAlert result={result} />
            {!isSuccessfulQueryResult(result) ? null : (
                <InteractionsCard interactions={result.interactions} />
            )}
        </section>
    )
}
