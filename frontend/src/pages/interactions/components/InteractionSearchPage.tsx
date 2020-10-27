import md5 from 'md5'
import React from 'react'

import { AppState } from 'app/types'
import { useAppSelector } from 'app/hooks'
import { Timeout, ToastContainer } from 'app/partials'

import { OptionsCard } from 'features/options'
import { TaxonomyCard } from 'features/taxonomy'
import { IdentifierCard } from 'features/identifiers'
import { parse as parseIdentifiers } from 'features/identifiers'

import { resources } from '../api'
import { Query } from '../types'

const QueryResultCard = React.lazy(() => import('./QueryResultCard').then(module => ({ default: module.QueryResultCard })))
const QueryResultAlert = React.lazy(() => import('./QueryResultAlert').then(module => ({ default: module.QueryResultAlert })))

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
            <React.Suspense fallback={<Timeout />}>
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

/**
 * Caution: Array.sort() mutates the array which is not allowed.
 * Need to clone identifiers and names (parseIdentifiers() or Array.slice()) before sorting.
 */
export const state2query = (state: AppState) => {
    const identifiers = parseIdentifiers(state.interactions.search.identifiers)
    const names = state.interactions.search.taxonomy.names.slice()
    const ncbi_taxon_id = state.interactions.search.taxonomy.taxon === null ? 0 : state.interactions.search.taxonomy.taxon.ncbi_taxon_id

    const parts: string[] = []
    if (state.interactions.search.options.hh) parts.push('HH')
    if (state.interactions.search.options.vh) parts.push('VH')
    if (state.interactions.search.options.hh && state.interactions.search.options.neighbors) parts.push('NEIGHBORS')
    parts.push(state.interactions.search.options.publications.toString())
    parts.push(state.interactions.search.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...names.sort((a: string, b: string) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a: string, b: string) => a.localeCompare(b)))

    return {
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: names,
        hh: state.interactions.search.options.hh,
        vh: state.interactions.search.options.vh,
        neighbors: state.interactions.search.options.neighbors,
        publications: state.interactions.search.options.publications,
        methods: state.interactions.search.options.methods,
    }
}
