import React, { Suspense, useState, useEffect } from 'react'

import { ResultWrapper } from 'features/query'

const Pagination = React.lazy(() => import('./Pagination').then(module => ({ default: module.Pagination })))
const InteractionCardTable = React.lazy(() => import('./InteractionCardTable').then(module => ({ default: module.InteractionCardTable })))
const NetworkControlCardBody = React.lazy(() => import('./NetworkControlCardBody').then(module => ({ default: module.NetworkControlCardBody })))
const NetworkStageCardBody = React.lazy(() => import('./NetworkStageCardBody').then(module => ({ default: module.NetworkStageCardBody })))

type Tab = 'list' | 'network'

type Props = {
    result: ResultWrapper
}

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    const [tab, setTab] = useState<Tab>('list')

    const getHandleClick = (tab: Tab) => (e: any) => {
        e.preventDefault()
        setTab(tab)
    }

    return (
        <div className="card">
            <div className="card-header pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'list' ? 'nav-link active' : 'nav-link'}
                            onClick={getHandleClick('list')}
                        >
                            List view
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'network' ? 'nav-link active' : 'nav-link'}
                            onClick={getHandleClick('network')}
                        >
                            Network view
                        </a>
                    </li>
                </ul>
            </div>
            <Suspense fallback={<ProgressBarCardBody />}>
                <CardBody tab={tab} result={result} />
            </Suspense>
        </div>
    )
}

const ProgressBarCardBody = () => (
    <div className="card-body">
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: '100%' }}
            ></div>
        </div>
    </div>
)

const CardBody: React.FC<{ tab: Tab } & Props> = ({ tab, result }) => {
    const [offset, setOffset] = useState(0)
    const [ratio, setRatio] = useState(100)
    const [labels, setLabels] = useState(false)

    useEffect(() => { setOffset(0) }, [result])
    useEffect(() => { setRatio(100) }, [result])
    useEffect(() => { setLabels(false) }, [result])

    switch (tab) {
        case 'list':
            const limit = 20
            const interactions = result.interactions.slice(offset, offset + limit);

            return (
                <React.Fragment>
                    <div className="card-body">
                        <Pagination offset={offset} limit={limit} total={result.interactions.length} update={setOffset} />
                    </div>
                    <InteractionCardTable interactions={interactions} limit={limit} />
                    <div className="card-body">
                        <Pagination offset={offset} limit={limit} total={result.interactions.length} update={setOffset} />
                    </div>
                </React.Fragment>
            )
        case 'network':
            const network = result.network()

            return (
                <React.Fragment>
                    <NetworkControlCardBody
                        ratio={ratio}
                        labels={labels}
                        network={network}
                        setRatio={setRatio}
                        setLabels={setLabels}
                    />
                    <NetworkStageCardBody network={network} />
                </React.Fragment>
            )
        default:
            throw new Error()
    }
}
