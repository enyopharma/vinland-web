import React from 'react'

import { Query, QueryResult } from 'features/query'
import { isSuccessfulQueryResult, cache, resources } from 'features/query'

import { QueryResultAlert } from './QueryResultAlert'
import { QueryResultCard } from './QueryResultCard'

type Props = {
    query: Query
}

export const QueryResultSection: React.FC<Props> = (props) => (
    <React.Suspense fallback={<SectionFallback />}>
        <Section {...props} />
    </React.Suspense>
)

const Section: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return (
        <section>
            <QueryResultAlert result={result} />
            <Card result={result} />
        </section>
    )
}

const Card: React.FC<{ result: QueryResult }> = ({ result }) => {
    return isSuccessfulQueryResult(result) && result.interactions.length > 0
        ? <QueryResultCard result={cache(result)} />
        : null
}

const SectionFallback: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: '100%' }}
        ></div>
    </div>
)
