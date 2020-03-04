import React from 'react'

import { Query } from 'features/query'
import { resources } from 'features/query'

import { QueryResultCard } from './QueryResultCard'
import { QueryResultAlert } from './QueryResultAlert'

type Props = {
    query: Query
}

export const QueryResultSection: React.FC<Props> = ({ query }) => (
    <React.Suspense fallback={<SectionFallback />}>
        <Section query={query} />
    </React.Suspense>
)

const Section: React.FC<Props> = ({ query }) => {
    const result = resources.result(query).read()

    return (
        <section>
            <QueryResultAlert result={result} />
            <QueryResultCard result={result} />
        </section>
    )
}

const SectionFallback: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: '100%' }}
        ></div>
    </div>
)
