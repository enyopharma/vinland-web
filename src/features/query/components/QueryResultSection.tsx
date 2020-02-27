import React from 'react'

import { Query } from 'features/query'
import { resources, wrapper } from 'features/query'
import { isSuccessfulQueryResult } from 'features/query'

import { QueryResultCard } from './QueryResultCard'
import { QueryResultAlert } from './QueryResultAlert'

type Props = {
    query: Query
}

export const QueryResultSection: React.FC<Props> = ({ query }) => (
    <React.Suspense fallback={<SectionFallback />}>
        <SectionLoader query={query} />
    </React.Suspense>
)

const SectionFallback: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: '100%' }}
        ></div>
    </div>
)

const SectionLoader: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return (
        <section>
            <QueryResultAlert result={result} />
            {!isSuccessfulQueryResult(result) ? null : (
                <QueryResultCard result={wrapper(result)} />
            )}
        </section>
    )
}
