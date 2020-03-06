import React from 'react'

import { Query, ComputationCache } from 'features/query'
import { isSuccessfulQueryResult, cache, resources } from 'features/query'
import { NavContext, useNavState } from 'features/query'

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

    const cached = isSuccessfulQueryResult(result) ? cache(result) : null

    return (
        <section>
            <QueryResultAlert result={result} />
            <QueryResultCardContext result={cached} />
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

const QueryResultCardContext: React.FC<{ result: ComputationCache | null }> = ({ result }) => {
    const value = useNavState(result)

    return !result ? null : (
        <NavContext.Provider value={value}>
            <QueryResultCard result={result} />
        </NavContext.Provider>
    )
}
