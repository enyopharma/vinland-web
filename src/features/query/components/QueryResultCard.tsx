import React, { useState, useEffect } from 'react'

import { QueryResult, ResultWrapper } from 'features/query'
import { isSuccessfulQueryResult, wrapper } from 'features/query'
import { proteins2csv, interactions2csv } from 'features/query'
import { config } from 'features/query'

const Pagination = React.lazy(() => import('./Pagination').then(module => ({ default: module.Pagination })))
const ProteinCardTable = React.lazy(() => import('./ProteinCardTable').then(module => ({ default: module.ProteinCardTable })))
const InteractionCardTable = React.lazy(() => import('./InteractionCardTable').then(module => ({ default: module.InteractionCardTable })))
const NetworkControlCardBody = React.lazy(() => import('./NetworkControlCardBody').then(module => ({ default: module.NetworkControlCardBody })))
const NetworkStageCardBody = React.lazy(() => import('./NetworkStageCardBody').then(module => ({ default: module.NetworkStageCardBody })))

type Props = {
    result: QueryResult
}

type TypeTab = 'interactions' | 'proteins' | 'network'
type ProteinTab = 'a' | 'h' | 'v'

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    const [ttab, setTypeTab] = useState<TypeTab>('interactions')
    const [ptab, setProteinTab] = useState<ProteinTab>('a')
    const [wrapped, setWrapped] = useState<ResultWrapper | null>(null)

    useEffect(() => {
        setWrapped(isSuccessfulQueryResult(result) ? wrapper(result) : null)
    }, [result])

    if (wrapped === null) {
        return null
    }

    return (
        <div className="card">
            <div className="card-header pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <TypeNavLink current={ttab} value="interactions" label="Interactions" update={setTypeTab} />
                    </li>
                    <li className="nav-item">
                        <TypeNavLink current={ttab} value="proteins" label="Proteins" update={setTypeTab} />
                    </li>
                    <li className="nav-item">
                        <TypeNavLink current={ttab} value="network" label="Network" update={setTypeTab} />
                    </li>
                </ul>
            </div>
            <React.Suspense fallback={<CardBodyFallback />}>
                <CardBody ttab={ttab} ptab={ptab} result={wrapped} setProteinTab={setProteinTab} />
            </React.Suspense>
        </div>
    )
}

const CardBody: React.FC<{ ttab: TypeTab, ptab: ProteinTab, result: ResultWrapper, setProteinTab: (ptab: ProteinTab) => void }> = (props) => {
    const { ttab, ptab, result, setProteinTab } = props

    const [offseti, setOffseti] = useState<number>(0)
    const [offsetp, setOffsetp] = useState<number>(0)
    const [ratio, setRatio] = useState<number>(config.ratio)
    const [labels, setLabels] = useState<boolean>(false)

    useEffect(() => { setOffseti(0) }, [result])
    useEffect(() => { setOffsetp(0) }, [result, ptab])
    useEffect(() => { setRatio(config.ratio) }, [result])
    useEffect(() => { setLabels(false) }, [result])

    switch (ttab) {
        case 'interactions': {
            const interactions = result.interactions

            return (
                <React.Fragment>
                    <div className="card-body">
                        <p className="text-right">
                            <CsvDownloadButton csv={() => interactions2csv(interactions)} />
                        </p>
                        <Pagination offset={offseti} total={interactions.length} setOffset={setOffseti} />
                    </div>
                    <InteractionCardTable interactions={interactions.slice(offseti, offseti + config.limit)} />
                    <div className="card-body">
                        <Pagination offset={offseti} total={interactions.length} setOffset={setOffseti} />
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
                                <ProteinNavCheckbox current={ptab} value="a" label="all" update={setProteinTab} />
                                <ProteinNavCheckbox current={ptab} value="h" label="human" update={setProteinTab} />
                                <ProteinNavCheckbox current={ptab} value="v" label="viral" update={setProteinTab} />
                            </div>
                            <div className="col">
                                <p className="text-right">
                                    <CsvDownloadButton csv={() => proteins2csv(proteins)} />
                                </p>
                            </div>
                        </div>
                        <Pagination offset={offsetp} total={proteins.length} setOffset={setOffsetp} />
                    </div>
                    <ProteinCardTable proteins={proteins.slice(offsetp, offsetp + config.limit)} />
                    <div className="card-body">
                        <Pagination offset={offsetp} total={proteins.length} setOffset={setOffsetp} />
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

const TypeNavLink: React.FC<{ current: TypeTab, value: TypeTab, label: string, update: (tab: TypeTab) => void }> = (props) => {
    const { current, value, label, update } = props

    const classes = current === value ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update(value)
    }

    return <a href="/" className={classes} onClick={onClick}>{label}</a>
}

const ProteinNavCheckbox: React.FC<{ current: ProteinTab, value: ProteinTab, label: string, update: (tab: ProteinTab) => void }> = (props) => {
    const { current, value, label, update } = props

    return (
        <div className="form-check form-check-inline">
            <input
                id={`ptab-${value}`}
                className="form-check-input"
                type="radio"
                name="ptab"
                value={value}
                checked={current === value}
                onChange={() => update(value)}
            />
            <label className="form-check-label" htmlFor={`ptab-${value}`}>
                {label}
            </label>
        </div>
    )
}

const CsvDownloadButton: React.FC<{ csv: () => string }> = ({ csv }) => {
    const prefix = 'data:text/csv;charset=utf-8,'

    const download = () => window.open(prefix + encodeURIComponent(csv()))

    return (
        <button className="btn btn-link p-0" onClick={download}>
            Download as csv
        </button>
    )
}

const CardBodyFallback: React.FC = () => (
    <div className="card-body">
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: '100%' }}
            ></div>
        </div>
    </div>
)
