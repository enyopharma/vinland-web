import React from 'react'

import { ComputationCache, Protein } from 'features/query'
import { useNavContext, ProteinTab as Tab } from 'features/query'
import { config, proteins2csv } from 'features/query'

import { Pagination } from './Pagination'
import { CardBodyFallback } from './CardBodyFallback'
import { CsvDownloadButton } from './CsvDownloadButton'

type Props = {
    result: ComputationCache
}

export const ProteinsCardBody: React.FC<Props> = (props) => (
    <React.Suspense fallback={<CardBodyFallback />}>
        <CardBody {...props} />
    </React.Suspense>
)

const CardBody: React.FC<Props> = ({ result }) => {
    const { human, viral } = result.proteins()

    const [{ proteins: { tab, offsets } }, dispatch] = useNavContext()

    const proteins = tab === 'h' ? human : tab === 'v' ? viral : [...human, ...viral]

    const slice = proteins.slice(offsets[tab], offsets[tab] + config.limit)

    const setOffset = (offset: number) => dispatch({ type: 'proteins.offset', payload: { tab, offset } })

    return (
        <React.Fragment>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <TabCheckbox tab="a">All</TabCheckbox>
                        <TabCheckbox tab="h">Human</TabCheckbox>
                        <TabCheckbox tab="v">Viral</TabCheckbox>
                    </div>
                    <div className="col">
                        <p className="text-right">
                            <CsvDownloadButton csv={() => proteins2csv(proteins)} />
                        </p>
                    </div>
                </div>
                <Pagination offset={offsets[tab]} total={proteins.length} update={setOffset} />
            </div>
            <table className="table card-table table-stripped table-hover">
                <thead>
                    <tr>
                        <th className="col-1 text-center">-</th>
                        <th className="col-2 text-center">Accession</th>
                        <th className="col-2 text-center">Name</th>
                        <th className="col-8 text-center">Taxon</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(config.limit)].map((_, i) => slice[i]
                        ? <ProteinTr key={i} protein={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="card-body">
                <Pagination offset={offsets[tab]} total={proteins.length} update={setOffset} />
            </div>
        </React.Fragment>
    )
}

const TabCheckbox: React.FC<{ tab: Tab }> = ({ tab, children }) => {
    const [{ proteins: { tab: current } }, dispatch] = useNavContext()

    const onChange = () => dispatch({ type: 'proteins.tab', payload: tab })

    return (
        <div className="form-check form-check-inline">
            <input
                id={`ptab-${tab}`}
                className="form-check-input"
                type="radio"
                name="ptab"
                value={tab}
                checked={current === tab}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={`ptab-${tab}`}>
                {children}
            </label>
        </div>
    )
}

const SkeletonTr: React.FC = () => (
    <tr>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
    </tr>
)

const ProteinTr: React.FC<{ protein: Protein }> = ({ protein }) => (
    <tr>
        <td className="text-center">
            <a href="/" style={{ textDecoration: 'none' }}>
                <img
                    src={`/img/${protein.type}.png`}
                    alt={`${protein.type.toUpperCase()} protein`}
                    style={{ maxWidth: '1em' }}
                />
            </a>
        </td>
        <td className="text-center">
            <a href="/" className={protein.type === 'h' ? 'text-info' : 'text-danger'}>
                {protein.accession}
            </a>
        </td>
        <td className="text-center">
            {protein.name}
        </td>
        <td className="text-center" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
        }}>
            <span title={protein.taxon.name}>
                {protein.taxon.name}
            </span>
        </td>
    </tr>
)
