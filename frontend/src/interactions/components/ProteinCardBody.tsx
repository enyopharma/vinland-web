import React from 'react'

import { Pagination, ProteinLink } from 'partials'

import { ProteinTab, Protein } from '../types'
import { actions } from '../reducers/nav'
import { useSelector, useActionCreator } from '../hooks'

import { CsvDownloadButton } from './CsvDownloadButton'

const limit = 10

type ProteinCardBodyProps = {
    proteins: Protein[]
}

export const ProteinCardBody: React.FC<ProteinCardBodyProps> = ({ proteins }) => {
    const tab = useSelector(state => state.nav.proteins.tab)

    const filtered = filter(tab, proteins)

    return (
        <React.Fragment>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <TabCheckbox tab="a">
                            All
                        </TabCheckbox>
                        <TabCheckbox tab="h">
                            Human
                        </TabCheckbox>
                        <TabCheckbox tab="v">
                            Viral
                        </TabCheckbox>
                    </div>
                    <div className="col">
                        <p className="text-right">
                            <CsvDownloadButton csv={() => proteins2csv(filtered)} enabled={filtered.length > 0}>
                                Download as csv
                            </CsvDownloadButton>
                        </p>
                    </div>
                </div>
            </div>
            {filtered.length > 0
                ? <ProteinTable proteins={filtered} />
                : <EmptyTable />
            }
        </React.Fragment>
    )
}

type TabCheckboxProps = {
    tab: ProteinTab
}

const TabCheckbox: React.FC<TabCheckboxProps> = ({ tab, children }) => {
    const current = useSelector(state => state.nav.proteins.tab)
    const update = useActionCreator(actions.setProteinsTab)

    return (
        <div className="form-check form-check-inline">
            <input
                id={`ptab-${tab}`}
                className="form-check-input"
                type="radio"
                name="ptab"
                value={tab}
                checked={current === tab}
                onChange={e => update(tab)}
            />
            <label className="form-check-label" htmlFor={`ptab-${tab}`}>
                {children}
            </label>
        </div>
    )
}

const EmptyTable: React.FC = () => {
    const tab = useSelector(state => state.nav.proteins.tab)

    return (
        <div className="card-body">
            <p className="text-center">
                {empty[tab]}
            </p>
        </div>
    )
}

type ProteinTableProps = {
    proteins: Protein[]
}

const ProteinTable: React.FC<ProteinTableProps> = ({ proteins }) => {
    const offset = useSelector(state => state.nav.proteins.current)
    const setOffset = useActionCreator(actions.setProteinsOffset)

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
            <ProteinLink {...protein}>
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

const empty = {
    a: "not protein found",
    h: "no human protein found",
    v: "no viral protein found"
}

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
