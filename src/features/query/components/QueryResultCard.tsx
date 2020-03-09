import React from 'react'

import { ComputationCache } from 'features/query'
import { usePersistentState } from 'features/query'

import { CardBodyFallback } from './CardBodyFallback'

const NetworkCardBody = React.lazy(() => import('./NetworkCardBody').then(module => ({ default: module.NetworkCardBody })))
const ProteinsCardBody = React.lazy(() => import('./ProteinsCardBody').then(module => ({ default: module.ProteinsCardBody })))
const InteractionsCardBody = React.lazy(() => import('./InteractionsCardBody').then(module => ({ default: module.InteractionsCardBody })))

type Props = {
    result: ComputationCache
}

type Tab = 'interactions' | 'proteins' | 'network'

export const QueryResultCard: React.FC<Props> = (props) => {
    const [tab, setTab] = usePersistentState<Tab>('tab', 'interactions')

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
            <React.Suspense fallback={<CardBodyFallback />}>
                <CardBody tab={tab} {...props} />
            </React.Suspense>
        </div>
    )
}

const CardBody: React.FC<{ tab: Tab, result: ComputationCache }> = ({ tab, result }) => {
    switch (tab) {
        case 'interactions':
            return <InteractionsCardBody result={result} />
        case 'proteins':
            return <ProteinsCardBody result={result} />
        case 'network':
            return <NetworkCardBody result={result} />
        default:
            throw new Error()
    }
}

const TabLink: React.FC<{ tab: Tab, current: Tab, update: (tab: Tab) => void }> = (props) => {
    const { tab, current, update, children } = props

    const classes = current === tab ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update(tab)
    }

    return <a href="/" className={classes} onClick={onClick}>{children}</a>
}
