import React from 'react'

import { QueryResult } from 'features/query'
import { isSuccessfulQueryResult, cache } from 'features/query'

import { QueryResultAlert } from './QueryResultAlert'
import { QueryResultCard } from './QueryResultCard'

type Props = {
    result: QueryResult
}

export const QueryResultSection: React.FC<Props> = ({ result }) => (
    <section>
        <QueryResultAlert result={result} />
        <Card result={result} />
    </section>
)

const Card: React.FC<Props> = ({ result }) => {
    return isSuccessfulQueryResult(result) && result.interactions.length > 0
        ? <QueryResultCard result={cache(result)} />
        : null
}
