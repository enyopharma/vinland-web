import md5 from 'md5'
import React from 'react'

import { Resource } from 'app/cache'
import { Timeout, PleaseWait } from 'partials'

import { resources } from '../api'
import { useSelector } from '../hooks'
import { ToastContainer } from '../toast'
import { SearchState, QueryResult } from '../types'
import { parse as parseIdentifiers } from '../utils'

import { TaxonomyCard } from './TaxonomyCard'
import { IdentifierCard } from './IdentifierCard'
import { DisplayOptionsCard } from './DisplayOptionsCard'

const QueryResultCard = React.lazy(() => import('./QueryResultCard').then(module => ({ default: module.QueryResultCard })))
const QueryResultAlert = React.lazy(() => import('./QueryResultAlert').then(module => ({ default: module.QueryResultAlert })))

export const InteractionSearchPage: React.FC = () => {
    const lists = useSelector(state => state.identifiers)
    const taxonomy = useSelector(state => state.taxonomy)
    const options = useSelector(state => state.options)
    const resource = useSelector(state2resource)

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
                    <DisplayOptionsCard options={options} />
                </fieldset>
            </form>
            <h2 id="result">Query result</h2>
            <ToastContainer target='result' />
            <React.Suspense fallback={<Timeout><PleaseWait /></Timeout>}>
                <QueryResultAlertFetcher resource={resource} />
                <QueryResultCardFetcher resource={resource} />
            </React.Suspense>
        </div>
    )
}

type QueryResultAlertFetcherProps = {
    resource: Resource<QueryResult>
}

const QueryResultAlertFetcher: React.FC<QueryResultAlertFetcherProps> = ({ resource }) => {
    const result = resource.read()

    return <QueryResultAlert result={result} />
}

type QueryResultCardFetcherProps = {
    resource: Resource<QueryResult>
}

const QueryResultCardFetcher: React.FC<QueryResultCardFetcherProps> = ({ resource }) => {
    const result = resource.read()

    return <QueryResultCard result={result} />
}

/**
 * Caution: Array.sort() mutates the array which is not allowed.
 * Need to clone identifiers and names (parseIdentifiers() or Array.slice()) before sorting.
 */
export const state2resource = (state: SearchState) => {
    const identifiers = parseIdentifiers(state.identifiers)
    const names = state.taxonomy.names.slice()
    const ncbi_taxon_id = state.taxonomy.taxon !== null
        ? state.taxonomy.taxon.ncbi_taxon_id
        : 0

    const parts: string[] = []
    if (state.options.hh) parts.push('HH')
    if (state.options.vh) parts.push('VH')
    if (state.options.hh && state.options.neighbors) parts.push('NEIGHBORS')
    parts.push(state.options.publications.toString())
    parts.push(state.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...names.sort((a: string, b: string) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a: string, b: string) => a.localeCompare(b)))

    return resources.result({
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: names,
        hh: state.options.hh,
        vh: state.options.vh,
        neighbors: state.options.neighbors,
        publications: state.options.publications,
        methods: state.options.methods,
    })
}
