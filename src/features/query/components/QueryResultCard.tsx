import React, { useState, useEffect, useContext } from 'react'

import { ResultWrapper } from 'features/query'

const Pagination = React.lazy(() => import('./Pagination').then(module => ({ default: module.Pagination })))
const ProteinCardTable = React.lazy(() => import('./ProteinCardTable').then(module => ({ default: module.ProteinCardTable })))
const InteractionCardTable = React.lazy(() => import('./InteractionCardTable').then(module => ({ default: module.InteractionCardTable })))
const NetworkControlCardBody = React.lazy(() => import('./NetworkControlCardBody').then(module => ({ default: module.NetworkControlCardBody })))
const NetworkStageCardBody = React.lazy(() => import('./NetworkStageCardBody').then(module => ({ default: module.NetworkStageCardBody })))

const limit = 20

type Tab = 'ppi' | 'h' | 'v' | 'network'

type Props = {
    result: ResultWrapper
}

let savedtab = 'ppi' as Tab

const TabContext = React.createContext({ tab: savedtab })

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    const [tab, setTab] = useState<Tab>(savedtab)

    useEffect(() => { savedtab = tab }, [tab])

    const getOnClick = (tab: Tab) => (e: React.MouseEvent) => {
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
                            className={tab === 'ppi' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('ppi')}
                        >
                            List view
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'h' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('h')}
                        >
                            Human proteins
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'v' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('v')}
                        >
                            Viral proteins
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'network' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('network')}
                        >
                            Network view
                        </a>
                    </li>
                </ul>
            </div>
            <TabContext.Provider value={{ tab: tab }}>
                <CardBody result={result} />
            </TabContext.Provider>
        </div>
    )
}

const CardBody: React.FC<Props> = ({ result }) => (
    <React.Suspense fallback={<CardBodyFallback />}>
        <CardBodyLoader result={result} />
    </React.Suspense>
)

const CardBodyFallback = () => (
    <div className="card-body">
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: '100%' }}
            ></div>
        </div>
    </div>
)

const CardBodyLoader: React.FC<Props> = ({ result }) => {
    const { tab } = useContext(TabContext)

    const [offseti, setOffseti] = useState(0)
    const [offseth, setOffseth] = useState(0)
    const [offsetv, setOffsetv] = useState(0)
    const [ratio, setRatio] = useState(100)
    const [labels, setLabels] = useState(false)

    useEffect(() => { setOffseti(0) }, [result])
    useEffect(() => { setOffseth(0) }, [result])
    useEffect(() => { setOffsetv(0) }, [result])
    useEffect(() => { setRatio(100) }, [result])
    useEffect(() => { setLabels(false) }, [result])

    switch (tab) {
        case 'ppi': {
            const interactions = result.interactions.slice(offseti, offseti + limit);

            return (
                <React.Fragment>
                    <div className="card-body">
                        <Pagination offset={offseti} limit={limit} total={result.interactions.length} update={setOffseti} />
                    </div>
                    <InteractionCardTable interactions={interactions} limit={limit} />
                    <div className="card-body">
                        <Pagination offset={offseti} limit={limit} total={result.interactions.length} update={setOffseti} />
                    </div>
                </React.Fragment>
            )
        }
        case 'h': {
            const proteins = result.proteins.human()

            const slice = proteins.slice(offseth, offseth + limit)

            return (
                <React.Fragment>
                    <div className="card-body">
                        <Pagination offset={offseth} limit={limit} total={proteins.length} update={setOffseth} />
                    </div>
                    <ProteinCardTable proteins={slice} limit={limit} />
                    <div className="card-body">
                        <Pagination offset={offseth} limit={limit} total={proteins.length} update={setOffseth} />
                    </div>
                </React.Fragment>
            )
        }
        case 'v': {
            const proteins = result.proteins.virus()

            const slice = proteins.slice(offsetv, offsetv + limit)

            return (
                <React.Fragment>
                    <div className="card-body">
                        <Pagination offset={offsetv} limit={limit} total={proteins.length} update={setOffsetv} />
                    </div>
                    <ProteinCardTable proteins={slice} limit={limit} />
                    <div className="card-body">
                        <Pagination offset={offsetv} limit={limit} total={proteins.length} update={setOffsetv} />
                    </div>
                </React.Fragment>
            )
        }
        case 'network': {
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
        }
        default:
            throw new Error()
    }
}
