import React, { useEffect, useState } from 'react'

import { ProgressBar } from 'app/partials'

import { config } from '../config'
import { QueryResult, QueryResultStatuses, SuccessfulQueryResult, ProteinTab } from '../types'

const ProteinCardBody = React.lazy(() => import('./ProteinCardBody').then(module => ({ default: module.ProteinCardBody })))
const NetworkCardBody = React.lazy(() => import('./NetworkCardBody').then(module => ({ default: module.NetworkCardBody })))
const InteractionCardBody = React.lazy(() => import('./InteractionCardBody').then(module => ({ default: module.InteractionCardBody })))

type Tab = 'interactions' | 'proteins' | 'network'

type Props = {
    result: QueryResult
}

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    const [tab, setTab] = useState<Tab>('interactions')
    const [interactionOffset, setInteractionOffset] = useState<number>(0)
    const [proteinTab, setProteinTab] = useState<ProteinTab>('a')
    const [proteinOffsets, setProteinOffsets] = useState<Record<ProteinTab, number>>({ a: 0, h: 0, v: 0 })
    const [networkRatio, setNetworkRatio] = useState<number>(config.ratio)
    const [networkLabels, setNetworkLabels] = useState<boolean>(false)

    useEffect(() => setInteractionOffset(0), [result])
    useEffect(() => setProteinOffsets({ a: 0, h: 0, v: 0 }), [result])

    const body = (result: SuccessfulQueryResult) => {
        switch (tab) {
            case 'interactions':
                return (
                    <InteractionCardBody
                        interactions={result.interactions}
                        offset={interactionOffset}
                        setOffset={setInteractionOffset}
                    />
                )
            case 'proteins':
                return (
                    <ProteinCardBodyFetcher
                        result={result}
                        tab={proteinTab}
                        setTab={setProteinTab}
                        offsets={proteinOffsets}
                        setOffsets={setProteinOffsets}
                    />
                )
            case 'network':
                return (
                    <NetworkCardBodyFetcher
                        result={result}
                        ratio={networkRatio}
                        labels={networkLabels}
                        setRatio={setNetworkRatio}
                        setLabels={setNetworkLabels}
                    />
                )
        }
    }

    switch (result.status) {
        case QueryResultStatuses.INCOMPLETE:
            return null
        case QueryResultStatuses.FAILURE:
            return null
        case QueryResultStatuses.SUCCESS:
            return (
                <div className="card">
                    <div className="card-header pb-0">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <TabLink tab="interactions" current={tab} update={setTab}>
                                    Interactions
                                </TabLink>
                            </li>
                            <li className="nav-item">
                                <TabLink tab="proteins" current={tab} update={setTab}>
                                    Proteins
                                </TabLink>
                            </li>
                            <li className="nav-item">
                                <TabLink tab="network" current={tab} update={setTab}>
                                    Network
                                </TabLink>
                            </li>
                        </ul>
                    </div>
                    <React.Suspense fallback={<Fallback />}>
                        {body(result)}
                    </React.Suspense>
                </div>
            )
    }
}

const Fallback: React.FC = () => (
    <div className="card-body">
        <ProgressBar />
    </div>
)

type TabLinkProps = {
    tab: Tab
    current: Tab
    update: (tab: Tab) => void
}

const TabLink: React.FC<TabLinkProps> = ({ tab, current, update, children }) => {
    const classes = current === tab ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update(tab)
    }

    return <a href="/" className={classes} onClick={onClick}>{children}</a>
}

type ProteinCardBodyFetcherProps = {
    result: SuccessfulQueryResult
    tab: ProteinTab
    offsets: Record<ProteinTab, number>
    setTab: (tab: ProteinTab) => void
    setOffsets: (offsets: Record<ProteinTab, number>) => void
}

const ProteinCardBodyFetcher: React.FC<ProteinCardBodyFetcherProps> = ({ result, ...props }) => {
    const proteins = result.proteins();

    return <ProteinCardBody proteins={proteins} {...props} />
}

type NetworkCardBodyFetcherProps = {
    result: SuccessfulQueryResult
    labels: boolean
    ratio: number
    setLabels: (labels: boolean) => void
    setRatio: (ratio: number) => void
}

const NetworkCardBodyFetcher: React.FC<NetworkCardBodyFetcherProps> = ({ result, ...props }) => {
    const network = result.network();

    return <NetworkCardBody network={network} {...props} />
}
