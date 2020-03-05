import React, { useContext, useReducer, useState, useEffect } from 'react'

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

type NavState = {
    tab: 'interactions' | 'proteins' | 'network'
    interactions: { offset: number }
    proteins: { tab: 'a' | 'h' | 'v', offsets: { a: number, h: number, v: number } }
    network: { ratio: number, labels: boolean }
}

type NavAction =
    | { type: 'tab', payload: NavState['tab'] }
    | { type: 'interactions.offset', payload: NavState['interactions']['offset'] }
    | { type: 'proteins.tab', payload: NavState['proteins']['tab'] }
    | { type: 'proteins.offset', payload: { tab: NavState['proteins']['tab'], offset: number } }
    | { type: 'network.ratio', payload: number }
    | { type: 'network.labels', payload: boolean }
    | { type: 'reset' }

const init = {
    tab: 'interactions' as NavState['tab'],
    interactions: { offset: 0 },
    proteins: { tab: 'a' as NavState['proteins']['tab'], offsets: { a: 0, h: 0, v: 0 } },
    network: { ratio: config.ratio, labels: false },
}

const reducer = (state: NavState, action: NavAction) => {
    switch (action.type) {
        case 'tab':
            return { ...state, tab: action.payload }
        case 'interactions.offset':
            return { ...state, interactions: { offset: action.payload } }
        case 'proteins.tab':
            return { ...state, proteins: { ...state.proteins, tab: action.payload } }
        case 'proteins.offset':
            const offsets = { ...state.proteins.offsets, [action.payload.tab]: action.payload.offset }

            return { ...state, proteins: { ...state.proteins, offsets } }
        case 'network.ratio':
            return { ...state, network: { ...state.network, ratio: action.payload } }
        case 'network.labels':
            return { ...state, network: { ...state.network, labels: action.payload } }
        case 'reset':
            return {
                tab: state.tab,
                interactions: { offset: 0 },
                proteins: { tab: state.proteins.tab, offsets: { a: 0, h: 0, v: 0 } },
                network: { ratio: config.ratio, labels: false },
            }
        default:
            throw new Error()
    }
}

const NavContext = React.createContext<{ state: NavState, dispatch: (action: NavAction) => void }>({
    state: init,
    dispatch: (_: NavAction) => { },
})

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    const [state, dispatch] = useReducer(reducer, init)
    const [wrapped, setWrapped] = useState<ResultWrapper | null>(null)

    useEffect(() => { dispatch({ type: 'reset' }) }, [result])
    useEffect(() => { setWrapped(isSuccessfulQueryResult(result) ? wrapper(result) : null) }, [result])

    if (wrapped === null) {
        return null
    }

    return (
        <NavContext.Provider value={{ state, dispatch }}>
            <div className="card">
                <div className="card-header pb-0">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <TypeTabLink value="interactions">Interactions</TypeTabLink>
                        </li>
                        <li className="nav-item">
                            <TypeTabLink value="proteins">Proteins</TypeTabLink>
                        </li>
                        <li className="nav-item">
                            <TypeTabLink value="network">Network</TypeTabLink>
                        </li>
                    </ul>
                </div>
                <React.Suspense fallback={<CardBodyFallback />}>
                    <CardBody result={wrapped} />
                </React.Suspense>
            </div>
        </NavContext.Provider>
    )
}

const CardBody: React.FC<{ result: ResultWrapper }> = ({ result }) => {
    const { state: { tab } } = useContext(NavContext)

    switch (tab) {
        case 'interactions':
            return <InteractionCardBody result={result} />
        case 'proteins':
            return <ProteinCardBody result={result} />
        case 'network':
            return <NetworkCardBody result={result} />
        default:
            throw new Error()
    }
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

const InteractionCardBody: React.FC<{ result: ResultWrapper }> = ({ result }) => {
    const { state: { interactions: { offset } }, dispatch } = useContext(NavContext)

    const interactions = result.interactions

    const setOffset = (payload: number) => dispatch({ type: 'interactions.offset', payload })

    return (
        <React.Fragment>
            <div className="card-body">
                <p className="text-right">
                    <CsvDownloadButton csv={() => interactions2csv(interactions)} />
                </p>
                <Pagination offset={offset} total={interactions.length} update={setOffset} />
            </div>
            <InteractionCardTable interactions={interactions.slice(offset, offset + config.limit)} />
            <div className="card-body">
                <Pagination offset={offset} total={interactions.length} update={setOffset} />
            </div>
        </React.Fragment>
    )
}

const ProteinCardBody: React.FC<{ result: ResultWrapper }> = ({ result }) => {
    const { state: { proteins: { tab, offsets } }, dispatch } = useContext(NavContext)

    const { human, viral } = result.proteins()

    const proteins = tab === 'h' ? human : tab === 'v' ? viral : [...human, ...viral]

    const setOffset = (offset: number) => dispatch({
        type: 'proteins.offset',
        payload: { tab, offset }
    })

    return (
        <React.Fragment>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <ProteinTabCheckbox value="a">All</ProteinTabCheckbox>
                        <ProteinTabCheckbox value="h">Human</ProteinTabCheckbox>
                        <ProteinTabCheckbox value="v">Viral</ProteinTabCheckbox>
                    </div>
                    <div className="col">
                        <p className="text-right">
                            <CsvDownloadButton csv={() => proteins2csv(proteins)} />
                        </p>
                    </div>
                </div>
                <Pagination offset={offsets[tab]} total={proteins.length} update={setOffset} />
            </div>
            <ProteinCardTable proteins={proteins.slice(offsets[tab], offsets[tab] + config.limit)} />
            <div className="card-body">
                <Pagination offset={offsets[tab]} total={proteins.length} update={setOffset} />
            </div>
        </React.Fragment>
    )
}

const NetworkCardBody: React.FC<{ result: ResultWrapper }> = ({ result }) => {
    const { state: { network: { ratio, labels } }, dispatch } = useContext(NavContext)

    const network = result.network()

    const setRatio = (payload: number) => dispatch({ type: 'network.ratio', payload })
    const setLabels = (payload: boolean) => dispatch({ type: 'network.labels', payload })

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

const TypeTabLink: React.FC<{ value: NavState['tab'] }> = ({ value, children }) => {
    const { state: { tab }, dispatch } = useContext(NavContext)

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        dispatch({ type: 'tab', payload: value })
    }

    return <a href="/" className={tab === value ? 'nav-link active' : 'nav-link'} onClick={onClick}>{children}</a>
}

const ProteinTabCheckbox: React.FC<{ value: NavState['proteins']['tab'] }> = ({ value, children }) => {
    const { state: { proteins: { tab } }, dispatch } = useContext(NavContext)

    const onChange = () => dispatch({ type: 'proteins.tab', payload: value })

    return (
        <div className="form-check form-check-inline">
            <input
                id={`ptab-${value}`}
                className="form-check-input"
                type="radio"
                name="ptab"
                value={value}
                checked={tab === value}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={`ptab-${value}`}>
                {children}
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
