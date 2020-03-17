import React from 'react'

import { ComputationCache, Protein } from 'features/query'
import { usePersistentState } from 'features/query'
import { config, proteins2csv } from 'features/query'

import { Pagination } from './Pagination'
import { CardBodyFallback } from './CardBodyFallback'
import { CsvDownloadButton } from './CsvDownloadButton'

type Props = {
    result: ComputationCache
}

type Tab = 'a' | 'h' | 'v'

export const ProteinsCardBody: React.FC<Props> = (props) => (
    <React.Suspense fallback={<CardBodyFallback />}>
        <CardBody {...props} />
    </React.Suspense>
)

const CardBody: React.FC<Props> = ({ result }) => {
    const { human, viral } = result.proteins()

    const [tab, setTab] = usePersistentState<Tab>('proteins.tab', 'a')
    const [offsets, setOffsets] = usePersistentState<Record<Tab, number>>('proteins.offsets', { a: 0, h: 0, v: 0 }, [result])

    const proteins = tab === 'h' ? human : tab === 'v' ? viral : [...human, ...viral]
    const offset = offsets[tab]
    const setOffset = (offset: number) => setOffsets({ ...offsets, [tab]: offset })

    const slice = proteins.slice(offset, offset + config.limit)

    return (
        <React.Fragment>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <TabCheckbox tab="a" current={tab} update={setTab}>
                            All
                        </TabCheckbox>
                        <TabCheckbox tab="h" current={tab} update={setTab}>
                            Human
                        </TabCheckbox>
                        <TabCheckbox tab="v" current={tab} update={setTab}>
                            Viral
                        </TabCheckbox>
                    </div>
                    <div className="col">
                        <p className="text-right">
                            <CsvDownloadButton csv={() => proteins2csv(proteins)}>
                                Download as csv
                            </CsvDownloadButton>
                        </p>
                    </div>
                </div>
                <Pagination offset={offset} total={proteins.length} update={setOffset} />
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
                <Pagination offset={offset} total={proteins.length} update={setOffset} />
            </div>
        </React.Fragment>
    )
}

const TabCheckbox: React.FC<{ tab: Tab, current: Tab, update: (tab: Tab) => void }> = (props) => {
    const { tab, current, update, children } = props

    const onChange = () => update(tab)

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
