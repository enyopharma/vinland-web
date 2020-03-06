import React from 'react'

import { ComputationCache } from 'features/query'
import { useNavContext, TypeTab as Tab } from 'features/query'

import { CardBodyFallback } from './CardBodyFallback'

const NetworkCardBody = React.lazy(() => import('./NetworkCardBody').then(module => ({ default: module.NetworkCardBody })))
const ProteinsCardBody = React.lazy(() => import('./ProteinsCardBody').then(module => ({ default: module.ProteinsCardBody })))
const InteractionsCardBody = React.lazy(() => import('./InteractionsCardBody').then(module => ({ default: module.InteractionsCardBody })))

type Props = {
    result: ComputationCache
}

export const QueryResultCard: React.FC<Props> = (props) => (
    <div className="card">
        <div className="card-header pb-0">
            <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                    <TabLink tab="interactions">Interactions</TabLink>
                </li>
                <li className="nav-item">
                    <TabLink tab="proteins">Proteins</TabLink>
                </li>
                <li className="nav-item">
                    <TabLink tab="network">Network</TabLink>
                </li>
            </ul>
        </div>
        <React.Suspense fallback={<CardBodyFallback />}>
            <CardBody {...props} />
        </React.Suspense>
    </div>
)

const CardBody: React.FC<{ result: ComputationCache }> = ({ result }) => {
    const [{ tab }] = useNavContext()

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

const TabLink: React.FC<{ tab: Tab }> = ({ tab, children }) => {
    const [{ tab: current }, dispatch] = useNavContext()

    const classes = current === tab ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        dispatch({ type: 'tab', payload: tab })
    }

    return <a href="/" className={classes} onClick={onClick}>{children}</a>
}
