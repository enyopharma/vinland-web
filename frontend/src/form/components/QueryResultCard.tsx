import React from 'react'

import { Timeout, Dots } from 'partials'

import { cache } from '../cache'
import { ResultTab } from '../types'
import { actions } from '../reducers/nav'
import { useSelector, useActionCreator } from '../hooks'
import { QueryResult, QueryResultStatuses, QueryResultCache } from '../types'

const ProteinCardBody = React.lazy(() => import('./ProteinCardBody').then(module => ({ default: module.ProteinCardBody })))
const NetworkCardBody = React.lazy(() => import('./NetworkCardBody').then(module => ({ default: module.NetworkCardBody })))
const InteractionCardBody = React.lazy(() => import('./InteractionCardBody').then(module => ({ default: module.InteractionCardBody })))

type QueryResultCardProps = {
    result: QueryResult
}

export const QueryResultCard: React.FC<QueryResultCardProps> = ({ result }) => {
    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return null
        case QueryResultStatuses.FAILURE:
            return null
        case QueryResultStatuses.SUCCESS:
            return <SuccessfulQueryResultCard cache={cache(result)} />
    }
}

type SuccessfulQueryResultCardProps = {
    cache: QueryResultCache
}

const SuccessfulQueryResultCard: React.FC<SuccessfulQueryResultCardProps> = ({ cache }) => (
    <div className="card">
        <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                    <ResultTabLink tab="interactions">
                        Interactions
                    </ResultTabLink>
                </li>
                <li className="nav-item">
                    <ResultTabLink tab="proteins">
                        Proteins
                    </ResultTabLink>
                </li>
                <li className="nav-item">
                    <ResultTabLink tab="network">
                        Network
                    </ResultTabLink>
                </li>
            </ul>
        </div>
        <SuccessfulQueryResultCardBody cache={cache} />
    </div>
)

type FallbackProps = {
    msg?: string
}

const Fallback: React.FC<FallbackProps> = ({ msg = 'Please wait' }) => (
    <div className="card-body">
        <Timeout>
            <div className="text-center">
                {msg} <Dots />
            </div>
        </Timeout>
    </div>
)

type ResultTabLinkProps = {
    tab: ResultTab
}

const ResultTabLink: React.FC<ResultTabLinkProps> = ({ tab, children }) => {
    const current = useSelector(state => state.nav.tab)
    const update = useActionCreator(actions.setResultTab)

    const classes = current === tab ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update(tab)
    }

    return <a href="/" className={classes} onClick={onClick}>{children}</a>
}

type SuccessfulQueryResultCardBodyProps = {
    cache: QueryResultCache
}

const SuccessfulQueryResultCardBody: React.FC<SuccessfulQueryResultCardBodyProps> = ({ cache }) => {
    const tab = useSelector(state => state.nav.tab)

    switch (tab) {
        case 'interactions':
            return <InteractionCardBody interactions={cache.interactions} />
        case 'proteins':
            return (
                <React.Suspense fallback={<Fallback msg="Building protein table" />}>
                    <ProteinCardBodyFetcher cache={cache} />
                </React.Suspense>
            )
        case 'network':
            return (
                <React.Suspense fallback={<Fallback msg="Building network" />}>
                    <NetworkCardBodyFetcher cache={cache} />
                </React.Suspense>
            )
    }
}

type ProteinCardBodyFetcherProps = {
    cache: QueryResultCache
}

const ProteinCardBodyFetcher: React.FC<ProteinCardBodyFetcherProps> = ({ cache }) => {
    const proteins = cache.proteins();

    return <ProteinCardBody proteins={proteins} />
}

type NetworkCardBodyFetcherProps = {
    cache: QueryResultCache
}

const NetworkCardBodyFetcher: React.FC<NetworkCardBodyFetcherProps> = ({ cache }) => {
    const warning = useSelector(state => state.nav.network.warning)
    const bypass = useActionCreator(actions.bypassWarning)

    if (cache.interactions.length > 1000 && warning) {
        return (
            <div className="card-body">
                Displaying a network of {cache.interactions.length} interactions can be very slow.
                <button type="button" className="btn btn-link" onClick={() => bypass()}>
                    Display anyway.
                </button>
            </div>
        )
    }

    const network = cache.network();

    return <NetworkCardBody network={network} />
}
