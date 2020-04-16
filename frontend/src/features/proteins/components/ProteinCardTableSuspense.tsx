import React from 'react'

import { resources } from 'features/proteins'
import { ProgressBar } from 'pages/partials'

const ProteinCardTable = React.lazy(() => import('./ProteinCardTable').then(module => ({ default: module.ProteinCardTable })))

type Props = {
    type: string
    query: string
}

export const ProteinCardTableSuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<Fallback />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ type, query }) => {
    const proteins = resources.proteins(type, query).read()

    return proteins.length > 0
        ? <ProteinCardTable proteins={proteins} />
        : <Empty />
}

const Empty: React.FC = () => (
    <div className="card-body">
        No protein found.
    </div>
)

const Fallback: React.FC = () => (
    <div className="card-body">
        <ProgressBar />
    </div>
)
