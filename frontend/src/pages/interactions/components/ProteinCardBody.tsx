import React from 'react'

import { Pagination, ProteinLink } from 'app/partials'

import { ProteinTab, Protein } from '../types'
import { CsvDownloadButton } from './CsvDownloadButton'

const limit = 10

type Props = {
    proteins: Protein[]
    tab: ProteinTab
    offsets: Record<ProteinTab, number>
    setTab: (tab: ProteinTab) => void
    setOffsets: (offsets: Record<ProteinTab, number>) => void
}

export const ProteinCardBody: React.FC<Props> = ({ proteins, tab, offsets, setTab, setOffsets }) => {
    const filtered = filter(tab, proteins)
    const offset = offsets[tab]
    const setOffset = (offset: number) => setOffsets({ ...offsets, [tab]: offset })

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
                            <CsvDownloadButton enabled={filtered.length > 0} csv={() => proteins2csv(filtered)}>
                                Download as csv
                            </CsvDownloadButton>
                        </p>
                    </div>
                </div>
            </div>
            {filtered.length > 0
                ? <ProteinTable proteins={filtered} offset={offset} setOffset={setOffset} />
                : <EmptyTable />
            }
        </React.Fragment>
    )
}

type TabCheckboxProps = {
    tab: ProteinTab
    current: ProteinTab
    update: (tab: ProteinTab) => void
}

const TabCheckbox: React.FC<TabCheckboxProps> = ({ tab, current, update, children }) => {
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

const EmptyTable: React.FC = () => (
    <div className="card-body">
        <p className="text-center">
            No viral protein
        </p>
    </div>
)

type ProteinTableProps = {
    proteins: Protein[]
    offset: number
    setOffset: (offset: number) => void
}

const ProteinTable: React.FC<ProteinTableProps> = ({ proteins, offset, setOffset }) => {
    const slice = proteins.slice(offset, offset + limit)

    return (
        <React.Fragment>
            <div className="card-body">
                <Pagination offset={offset} total={proteins.length} limit={limit} update={setOffset} />
            </div>
            <table className="table card-table table-stripped table-hover">
                <thead>
                    <tr>
                        <th className="col-1 text-center">-</th>
                        <th className="col-2 text-center">Accession</th>
                        <th className="col-2 text-center">Name</th>
                        <th className="col-3 text-center">Taxon</th>
                        <th className="col-4 text-center">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(limit)].map((_, i) => slice[i]
                        ? <ProteinTr key={i} protein={slice[i]} />
                        : <SkeletonTr />
                    )}
                </tbody>
            </table>
            <div className="card-body">
                <Pagination offset={offset} total={proteins.length} limit={limit} update={setOffset} />
            </div>
        </React.Fragment>
    )
}

const SkeletonTr: React.FC = () => (
    <tr>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
    </tr>
)

type ProteinTrProps = {
    protein: Protein
}

const ProteinTr: React.FC<ProteinTrProps> = ({ protein }) => (
    <tr>
        <td className="text-center">
            <ProteinLink {...protein} target="_blank">
                <img
                    src={`/img/${protein.type}.png`}
                    alt={`${protein.type.toUpperCase()} protein`}
                    style={{ maxWidth: '1em' }}
                />
            </ProteinLink>
        </td>
        <td className="text-center">
            <ProteinLink {...protein} target="_blank">
                <span className={protein.type === 'h' ? 'text-info' : 'text-danger'}>
                    {protein.accession}
                </span>
            </ProteinLink>
        </td>
        <td className="text-center">
            {protein.name}
        </td>
        <td className="text-center ellipsis">
            <span title={protein.taxon.name}>
                {protein.taxon.name}
            </span>
        </td>
        <td className="text-center ellipsis">
            <span title={protein.description}>
                {protein.description}
            </span>
        </td>
    </tr>
)

const filter = (type: ProteinTab, proteins: Protein[]) => {
    if (type === 'h') {
        return proteins.filter(protein => protein.type === 'h')
    }

    if (type === 'v') {
        return proteins.filter(protein => protein.type === 'v')
    }

    return proteins
}

const proteins2csv = (proteins: Protein[], sep: string = "\t") => {
    const headers = ['type', 'accession', 'name', 'taxon', 'description']

    const fields = (p: Protein) => [p.type, p.accession, p.name, p.taxon.name, p.description]

    return `#${headers.join(sep)}\n${proteins.map(p => fields(p).join(sep)).join("\n")}`
}
