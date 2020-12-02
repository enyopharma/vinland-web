import React from 'react'

import { resources } from '../api'
import { useSelector } from '../hooks'
import { PageState, Resource, QueryResult } from '../types'
import { Timeout, Dots } from 'partials'

const QueryResultCard = React.lazy(() => import('./QueryResultCard').then(module => ({ default: module.QueryResultCard })))
const QueryResultAlert = React.lazy(() => import('./QueryResultAlert').then(module => ({ default: module.QueryResultAlert })))

export const QueryResultSection: React.FC = () => {
    const { resource } = useSelector(state2resource, (next, prev) => next.key === prev.key)

    return (
        <React.Suspense fallback={<Fallback />}>
            <QueryResultSectionFetcher resource={resource} />
        </React.Suspense>
    )
}

const Fallback: React.FC = () => (
    <Timeout>
        <div className="text-center">
            Please wait <Dots />
        </div>
    </Timeout>
)

type QueryResultSectionFetcherProps = {
    resource: Resource<QueryResult>
}

const QueryResultSectionFetcher: React.FC<QueryResultSectionFetcherProps> = ({ resource }) => {
    const result = resource.read()

    return (
        <React.Fragment>
            <QueryResultAlert result={result} />
            <QueryResultCard result={result} />
        </React.Fragment>
    )
}

export const state2resource = (state: PageState) => ({
    key: state.key,
    resource: resources.result({
        key: state.key,
        identifiers: state.identifiers.parsed,
        ncbi_taxon_id: state.taxonomy.taxon !== null
            ? state.taxonomy.taxon.ncbi_taxon_id
            : 0,
        names: state.taxonomy.names,
        hh: state.options.hh,
        vh: state.options.vh,
        neighbors: state.options.neighbors,
        publications: state.options.publications,
        methods: state.options.methods,
    })
})
