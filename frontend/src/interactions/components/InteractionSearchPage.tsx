import md5 from 'md5'
import React from 'react'

import { AppState } from 'app/types'
import { Resource } from 'app/cache'
import { useAppSelector } from 'app/hooks'
import { ToastContainer } from 'app/toast'
import { Timeout, PleaseWait } from 'app/partials'

import { resources } from '../api'
import { QueryResult } from '../types'
import { parse as parseIdentifiers } from '../utils'
import { TaxonomyCard } from './TaxonomyCard'
import { IdentifierCard } from './IdentifierCard'
import { DisplayOptionsCard } from './DisplayOptionsCard'

const QueryResultCard = React.lazy(() => import('./QueryResultCard').then(module => ({ default: module.QueryResultCard })))
const QueryResultAlert = React.lazy(() => import('./QueryResultAlert').then(module => ({ default: module.QueryResultAlert })))

export const InteractionSearchPage: React.FC = () => {
    const lists = useAppSelector(state => state.interactions.search.identifiers)
    const taxonomy = useAppSelector(state => state.interactions.search.taxonomy)
    const options = useAppSelector(state => state.interactions.search.options)
    const resource = useAppSelector(state2resource)

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
export const state2resource = (state: AppState) => {
    const search = state.interactions.search
    const identifiers = parseIdentifiers(search.identifiers)
    const names = search.taxonomy.names.slice()
    const ncbi_taxon_id = search.taxonomy.taxon !== null
        ? search.taxonomy.taxon.ncbi_taxon_id
        : 0

    const parts: string[] = []
    if (search.options.hh) parts.push('HH')
    if (search.options.vh) parts.push('VH')
    if (search.options.hh && search.options.neighbors) parts.push('NEIGHBORS')
    parts.push(search.options.publications.toString())
    parts.push(search.options.methods.toString())
    parts.push(ncbi_taxon_id.toString())
    parts.push(...names.sort((a: string, b: string) => a.localeCompare(b)))
    parts.push(...identifiers.sort((a: string, b: string) => a.localeCompare(b)))

    return resources.result({
        key: md5(parts.join(':')),
        identifiers: identifiers,
        ncbi_taxon_id: ncbi_taxon_id,
        names: names,
        hh: search.options.hh,
        vh: search.options.vh,
        neighbors: search.options.neighbors,
        publications: search.options.publications,
        methods: search.options.methods,
    })
}
