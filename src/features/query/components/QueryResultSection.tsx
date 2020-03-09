import React from 'react'

import { Query } from 'features/query'
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
            {isSuccessfulQueryResult(result) ? <QueryResultCard result={cache(result)} /> : null}
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
