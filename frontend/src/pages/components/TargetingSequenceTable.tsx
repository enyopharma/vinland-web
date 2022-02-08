import React, { useState } from 'react'

import { Pagination, ProteinLinkImg, ProteinLinkColor, InteractionLinkImg } from 'partials'

import { TargetingSequence } from '../types'

const limit = 10

type TargetingSequenceTableProps = {
    mappings: TargetingSequence[]
}

export const TargetingSequenceTable: React.FC<TargetingSequenceTableProps> = ({ mappings }) => {
    const lengths = mappings.map(m => m.sequence.length)

    const min = Math.min(...lengths)
    const max = Math.max(...lengths)

    const [{ offset, length }, setState] = useState<{ offset: number, length: number }>({ offset: 0, length: max })

    const setOffset = (offset: number) => setState(state => ({ ...state, offset }))
    const setLength = (length: number) => setState({ offset: 0, length })

    const filtered = mappings.filter(filteri(length))

    const slice = filtered.sort(sorti).slice(offset, offset + limit)

    return (
        <React.Fragment>
            <div className="row mb-4">
                <div className="col">
                    <Pagination offset={offset} total={filtered.length} limit={limit} update={setOffset} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label htmlFor="mapping-max-length">Maximum length: {length}</label>
                    <input
                        id="mapping-max-length"
                        type="range"
                        className="custom-range"
                        value={length}
                        min={min}
                        max={max}
                        step="1"
                        onChange={e => setLength(parseInt(e.target.value))}
                    />
                </div>
            </div>
            <table className="table mb-0" style={{ lineHeight: '30px' }}>
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '8%' }}>-</th>
                        <th className="text-center" style={{ width: '10%' }}>Accession</th>
                        <th className="text-center" style={{ width: '10%' }}>Name</th>
                        <th className="text-center" style={{ width: '32%' }}>Taxon</th>
                        <th className="text-center" style={{ width: '40%' }}>Sequence</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(limit)].map((_, i) => slice[i]
                        ? <InteractionTr key={i} mapping={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="row mt-4">
                <div className="col">
                    <Pagination offset={offset} total={filtered.length} limit={limit} update={setOffset} />
                </div>
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

type InteractionTrProps = {
    mapping: TargetingSequence
}

const InteractionTr: React.FC<InteractionTrProps> = ({ mapping }) => (
    <tr key={0}>
        <td className="text-center">
            <ProteinLinkImg {...mapping.source} />
            &nbsp;
            <InteractionLinkImg {...mapping.interaction} />
        </td>
        <td className="text-center">
            <ProteinLinkColor {...mapping.source}>
                {mapping.source.accession}
            </ProteinLinkColor>
        </td>
        <td className="text-center">
            <ProteinLinkColor {...mapping.source}>
                {mapping.source.name}
            </ProteinLinkColor>
        </td>
        <td className="text-center ellipsis">
            <span title={mapping.source.taxon}>{mapping.source.taxon}</span>
        </td>
        <td>
            <input type="text" className="form-control" readOnly value={mapping.sequence} />
        </td>
    </tr>
)

const filteri = (length: number) => (mapping: TargetingSequence) => {
    return mapping.sequence.length <= length
}

const sorti = (a: TargetingSequence, b: TargetingSequence) => {
    const difft = a.source.ncbi_taxon_id - b.source.ncbi_taxon_id

    if (difft !== 0) return difft

    return a.sequence.length - b.sequence.length
}
