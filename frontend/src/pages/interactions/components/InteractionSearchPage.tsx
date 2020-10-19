import React from 'react'

import { useAppSelector } from 'app'
import { ProgressBar, ToastContainer } from 'partials'

import { OptionsCard } from 'features/options'
import { TaxonomyCard } from 'features/taxonomy'
import { IdentifierCard } from 'features/identifiers'

import { resources } from '../api'
import { state2query } from '../utils'
import { Query } from '../types'
import { QueryResultCard } from './QueryResultCard'
import { QueryResultAlert } from './QueryResultAlert'

export const InteractionSearchPage: React.FC = () => {
    const lists = useAppSelector(state => state.interactions.search.identifiers)
    const taxonomy = useAppSelector(state => state.interactions.search.taxonomy)
    const options = useAppSelector(state => state.interactions.search.options)
    const query = useAppSelector(state2query)

    return (
        <div className="container">
            <h1>Search for interactions</h1>
            <form action="#" className="form-horizontal" onSubmit={e => e.preventDefault()}>
                <fieldset>
                    <legend>Human protein identifiers</legend>
                    <IdentifierCard lists={lists} />
                </fieldset>
                <fieldset>
                    <legend>Viral taxonomy</legend>
                    <TaxonomyCard taxonomy={taxonomy} />
                </fieldset>
                <fieldset>
                    <legend>PPI display options</legend>
                    <OptionsCard options={options} />
                </fieldset>
            </form>
            <h2 id="result">Query result</h2>
            <ToastContainer target='result' />
            <React.Suspense fallback={<ProgressBar />}>
                <QueryResultAlertFetcher query={query} />
                <QueryResultCardFetcher query={query} />
            </React.Suspense>
        </div>
    )
}

type QueryResultAlertFetcherProps = {
    query: Query
}

const QueryResultAlertFetcher: React.FC<QueryResultAlertFetcherProps> = ({ query }) => {
    const result = resources.result(query).read()

    return <QueryResultAlert result={result} />
}

type QueryResultCardFetcherProps = {
    query: Query
}

const QueryResultCardFetcher: React.FC<QueryResultCardFetcherProps> = ({ query }) => {
    const result = resources.result(query).read()

    return <QueryResultCard result={result} />
}
