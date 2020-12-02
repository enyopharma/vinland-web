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
        <div className="card-header pb-0">
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
        <React.Suspense fallback={<Fallback />}>
            <SuccessfulQueryResultCardBody cache={cache} />
        </React.Suspense>
    </div>
)

const Fallback: React.FC = () => (
    <Timeout>
        <div className="card-body">
            <div className="text-center">
                Please wait <Dots />
            </div>
        </div>
    </Timeout>
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
            return <ProteinCardBodyFetcher cache={cache} />
        case 'network':
            return <NetworkCardBodyFetcher cache={cache} />
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
    const network = cache.network();

    return <NetworkCardBody network={network} />
}
