import React, { useEffect, useState } from 'react'

import { Timeout, PleaseWait } from 'partials'

import { cache } from '../cache'
import { config } from '../config'
import { ResultTab, ProteinTab } from '../types'
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

const SuccessfulQueryResultCard: React.FC<SuccessfulQueryResultCardProps> = ({ cache }) => {
    const [tab, setTab] = useState<ResultTab>('interactions')
    const [interactionOffset, setInteractionOffset] = useState<number>(0)
    const [proteinTab, setProteinTab] = useState<ProteinTab>('a')
    const [proteinOffsets, setProteinOffsets] = useState<Record<ProteinTab, number>>({ a: 0, h: 0, v: 0 })
    const [networkRatio, setNetworkRatio] = useState<number>(config.ratio)
    const [networkLabels, setNetworkLabels] = useState<boolean>(false)

    useEffect(() => setInteractionOffset(0), [cache])
    useEffect(() => setProteinOffsets({ a: 0, h: 0, v: 0 }), [cache])

    const body = () => {
        switch (tab) {
            case 'interactions':
                return (
                    <InteractionCardBody
                        interactions={cache.interactions}
                        offset={interactionOffset}
                        setOffset={setInteractionOffset}
                    />
                )
            case 'proteins':
                return (
                    <ProteinCardBodyFetcher
                        cache={cache}
                        tab={proteinTab}
                        setTab={setProteinTab}
                        offsets={proteinOffsets}
                        setOffsets={setProteinOffsets}
                    />
                )
            case 'network':
                return (
                    <NetworkCardBodyFetcher
                        cache={cache}
                        ratio={networkRatio}
                        labels={networkLabels}
                        setRatio={setNetworkRatio}
                        setLabels={setNetworkLabels}
                    />
                )
        }
    }

    return (
        <div className="card">
            <div className="card-header pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <ResultTabLink tab="interactions" current={tab} update={setTab}>
                            Interactions
                        </ResultTabLink>
                    </li>
                    <li className="nav-item">
                        <ResultTabLink tab="proteins" current={tab} update={setTab}>
                            Proteins
                        </ResultTabLink>
                    </li>
                    <li className="nav-item">
                        <ResultTabLink tab="network" current={tab} update={setTab}>
                            Network
                        </ResultTabLink>
                    </li>
                </ul>
            </div>
            <React.Suspense fallback={<Timeout><PleaseWait /></Timeout>}>
                {body()}
            </React.Suspense>
        </div>
    )
}

type ResultTabLinkProps = {
    tab: ResultTab
    current: ResultTab
    update: (tab: ResultTab) => void
}

const ResultTabLink: React.FC<ResultTabLinkProps> = ({ tab, current, update, children }) => {
    const classes = current === tab ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update(tab)
    }

    return <a href="/" className={classes} onClick={onClick}>{children}</a>
}

type ProteinCardBodyFetcherProps = {
    cache: QueryResultCache
    tab: ProteinTab
    offsets: Record<ProteinTab, number>
    setTab: (tab: ProteinTab) => void
    setOffsets: (offsets: Record<ProteinTab, number>) => void
}

const ProteinCardBodyFetcher: React.FC<ProteinCardBodyFetcherProps> = ({ cache, ...props }) => {
    const proteins = cache.proteins();

    return <ProteinCardBody proteins={proteins} {...props} />
}

type NetworkCardBodyFetcherProps = {
    cache: QueryResultCache
    labels: boolean
    ratio: number
    setLabels: (labels: boolean) => void
    setRatio: (ratio: number) => void
}

const NetworkCardBodyFetcher: React.FC<NetworkCardBodyFetcherProps> = ({ cache, ...props }) => {
    const network = cache.network();

    return <NetworkCardBody network={network} {...props} />
}
