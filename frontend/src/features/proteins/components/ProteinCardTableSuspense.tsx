import React from 'react'

import { resources } from 'features/proteins'

import { ProteinCardTable } from './ProteinCardTable'

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

    return proteins.length === 0
        ? <EmptyResult />
        : <ProteinCardTable proteins={proteins} />
}

const EmptyResult: React.FC = () => (
    <div className="card-body">
        No protein found.
    </div>
)

const Fallback: React.FC = () => (
    <div className="card-body">
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: '100%' }}
            ></div>
        </div>
    </div>
)
