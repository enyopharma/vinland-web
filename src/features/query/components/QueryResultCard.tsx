import React, { useState, useEffect } from 'react'

import { ResultWrapper } from 'features/query'
import { proteins2csv, interactions2csv } from 'features/query'

const Pagination = React.lazy(() => import('./Pagination').then(module => ({ default: module.Pagination })))
const ProteinCardTable = React.lazy(() => import('./ProteinCardTable').then(module => ({ default: module.ProteinCardTable })))
const InteractionCardTable = React.lazy(() => import('./InteractionCardTable').then(module => ({ default: module.InteractionCardTable })))
const NetworkControlCardBody = React.lazy(() => import('./NetworkControlCardBody').then(module => ({ default: module.NetworkControlCardBody })))
const NetworkStageCardBody = React.lazy(() => import('./NetworkStageCardBody').then(module => ({ default: module.NetworkStageCardBody })))

const limit = 20

type Tab = 'interactions' | 'proteins' | 'network'

type Props = {
    result: ResultWrapper
}

let savedtab = 'interactions' as Tab

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
                            className={tab === 'interactions' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('interactions')}
                        >
                            Interactions
                    </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'proteins' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('proteins')}
                        >
                            Proteins
                    </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'network' ? 'nav-link active' : 'nav-link'}
                            onClick={getOnClick('network')}
                        >
                            Network
                    </a>
                    </li>
                </ul>
            </div>
            <React.Suspense fallback={<CardBodyFallback />}>
                <CardBodyLoader tab={tab} result={result} />
            </React.Suspense>
        </div>
    )
}

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

type CardBodyProps = {
    tab: Tab
    result: ResultWrapper
}

type ProteinTab = 'a' | 'h' | 'v'

let savedptab = 'a' as ProteinTab

const CardBodyLoader: React.FC<CardBodyProps> = ({ tab, result }) => {
    const [ptab, setPtab] = useState<ProteinTab>(savedptab)
    const [offseti, setOffseti] = useState(0)
    const [offsetp, setOffsetp] = useState(0)
    const [ratio, setRatio] = useState(100)
    const [labels, setLabels] = useState(false)

    useEffect(() => { setOffsetp(0) }, [ptab])
    useEffect(() => { savedptab = ptab }, [ptab])
    useEffect(() => { setOffseti(0) }, [result])
    useEffect(() => { setOffsetp(0) }, [result])
    useEffect(() => { setRatio(100) }, [result])
    useEffect(() => { setLabels(false) }, [result])

    const download = (csv: () => string) => (e: React.MouseEvent) => {
        e.preventDefault()
        window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv()))
    }

    switch (tab) {
        case 'interactions': {
            const interactions = result.interactions

            return (
                <React.Fragment>
                    <div className="card-body">
                        <p className="text-right">
                            <a href="/" onClick={download(() => interactions2csv(interactions))}>
                                Download as csv
                            </a>
                        </p>
                        <Pagination offset={offseti} limit={limit} total={interactions.length} update={setOffseti} />
                    </div>
                    <InteractionCardTable
                        interactions={interactions.slice(offseti, offseti + limit)}
                        limit={limit}
                    />
                    <div className="card-body">
                        <Pagination offset={offseti} limit={limit} total={interactions.length} update={setOffseti} />
                    </div>
                </React.Fragment>
            )
        }

        case 'proteins': {
            const { human, viral } = result.proteins()

            const proteins = ptab === 'h' ? human : ptab === 'v' ? viral : [...human, ...viral]

            return (
                <React.Fragment>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <div className="form-check form-check-inline">
                                    <input
                                        id="ptab-a"
                                        className="form-check-input"
                                        type="radio"
                                        name="ptab"
                                        value="a"
                                        checked={ptab === 'a'}
                                        onChange={() => setPtab('a')}
                                    />
                                    <label className="form-check-label" htmlFor="ptab-a">all</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        id="ptab-h"
                                        className="form-check-input"
                                        type="radio"
                                        name="ptab"
                                        value="h"
                                        checked={ptab === 'h'}
                                        onChange={() => setPtab('h')}
                                    />
                                    <label className="form-check-label" htmlFor="ptab-h">human</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        id="ptab-v"
                                        className="form-check-input"
                                        type="radio"
                                        name="ptab"
                                        value="v"
                                        checked={ptab === 'v'}
                                        onChange={() => setPtab('v')}
                                    />
                                    <label className="form-check-label" htmlFor="ptab-v">virus</label>
                                </div>
                            </div>
                            <div className="col">
                                <p className="text-right">
                                    <a href="/" onClick={download(() => proteins2csv(proteins))} className="text-right">
                                        Download as csv
                                    </a>
                                </p>
                            </div>
                        </div>
                        <Pagination offset={offsetp} limit={limit} total={proteins.length} update={setOffsetp} />
                    </div>
                    <ProteinCardTable
                        proteins={proteins.slice(offsetp, offsetp + limit)}
                        limit={limit}
                    />
                    <div className="card-body">
                        <Pagination offset={offsetp} limit={limit} total={proteins.length} update={setOffsetp} />
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
