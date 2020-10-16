import React from 'react'

import { QueryResultTab as Tab, ComputationCache } from 'features/query'
import { ProgressBar } from 'partials'

const NetworkCardBody = React.lazy(() => import('./NetworkCardBody').then(module => ({ default: module.NetworkCardBody })))
const ProteinsCardBody = React.lazy(() => import('./ProteinsCardBody').then(module => ({ default: module.ProteinsCardBody })))
const InteractionsCardBody = React.lazy(() => import('./InteractionsCardBody').then(module => ({ default: module.InteractionsCardBody })))

type Props = {
    tab: Tab
    result: ComputationCache
}

export const QueryResultCardBodySuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<Fallback />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ tab, result }) => {
    switch (tab) {
        case 'interactions':
            return <InteractionsCardBody interactions={result.interactions} />
        case 'proteins':
            const proteins = result.proteins()

            return <ProteinsCardBody proteins={proteins} />
        case 'network':
            const network = result.network()

            return <NetworkCardBody network={network} />
        default:
            throw new Error()
    }
}

const Fallback: React.FC = () => (
    <div className="card-body">
        <ProgressBar />
    </div>
)
