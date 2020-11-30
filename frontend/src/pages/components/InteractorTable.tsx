import React, { useState } from 'react'

import { Pagination, ProteinLinkImg, ProteinLinkColor, InteractionLinkImg } from 'partials'

import { clusters } from '../utils'
import { Interactor, Isoform } from '../types'

import { MappingImg } from './MappingImg'

const limit = 10

type InteractorTableProps = {
    type: 'h' | 'v'
    isoform: Isoform
    interactors: Interactor[]
}

export const InteractorTable: React.FC<InteractorTableProps> = ({ type, isoform, interactors }) => {
    const [offset, setOffset] = useState<number>(0)

    const slice = interactors.sort(sorti).slice(offset, offset + limit)

    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <Pagination offset={offset} total={interactors.length} limit={limit} update={setOffset} />
                </div>
            </div>
            <table className="table" style={{ lineHeight: '30px' }}>
                <thead>
                    <tr>
                        <th className="text-center">-</th>
                        <th className="text-center">Accession</th>
                        <th className="text-center">Name</th>
                        <th className="text-center" style={{ width: '16%' }}>Taxon</th>
                        <th className="text-center" style={{ width: '24%' }}>Description</th>
                        <th className="text-center" style={{ width: '32%' }}>Mapping</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(limit)].map((_, i) => slice[i]
                        ? <InteractionTr key={i} type={type} isoform={isoform} interactor={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="row">
                <div className="col">
                    <Pagination offset={offset} total={interactors.length} limit={limit} update={setOffset} />
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
        <td className="text-center">-</td>
    </tr>
)

type InteractionTrProps = {
    type: 'h' | 'v'
    isoform: Isoform
    interactor: Interactor
}

const InteractionTr: React.FC<InteractionTrProps> = ({ type, isoform, interactor }) => {
    const width = isoform.sequence.length
    const mappings = interactor.mappings.filter(m => isoform.id === m.sequence_id)
    const clx = clusters(mappings)
    const rowspan = clx.length > 1 ? clx.length : undefined

    return (
        <React.Fragment>
            <tr key={0}>
                <td className="text-center" rowSpan={rowspan}>
                    <InteractionLinkImg {...interactor.interaction} />
                    &nbsp;
                    <ProteinLinkImg {...interactor.protein} />
                </td>
                <td className="text-center" rowSpan={rowspan}>
                    <ProteinLinkColor {...interactor.protein}>
                        {interactor.protein.accession}
                    </ProteinLinkColor>
                </td>
                <td className="text-center" rowSpan={rowspan}>
                    <ProteinLinkColor {...interactor.protein}>
                        {interactor.protein.name}
                    </ProteinLinkColor>
                </td>
                <td className="text-center ellipsis" rowSpan={rowspan}>
                    <span title={interactor.protein.taxon}>
                        {interactor.protein.taxon}
                    </span>
                </td>
                <td className="ellipsis" rowSpan={rowspan}>
                    <span title={interactor.protein.description}>
                        {interactor.protein.description}
                    </span>
                </td>
                <td className="text-center">
                    {clx.length === 0 ? '-' : <MappingImg type={type} width={width} mappings={clx[0]} />}
                </td>
            </tr>
            {clx.slice(1).map((mappings, m) => (
                <tr key={m + 1}>
                    <td className="text-center">
                        <MappingImg type={type} width={width} mappings={mappings} />
                    </td>
                </tr>
            ))}
        </React.Fragment>
    )
}

const sorti = (a: Interactor, b: Interactor) => {
    // 1. min interaction id when no interaction has mapping
    if (a.mappings.length === 0 && b.mappings.length === 0) {
        return a.interaction.id - b.interaction.id
    }

    // 2. whether one interaction has mapping and not the other
    if (a.mappings.length > 0 && b.mappings.length === 0) return -1
    if (a.mappings.length === 0 && b.mappings.length > 0) return +1

    // 3. when both interaction has mapping the order is:
    //    - min start
    //    - max density
    //    - min interaction id
    const starta = Math.min(...a.mappings.map(mapping => mapping.start))
    const startb = Math.min(...b.mappings.map(mapping => mapping.start))
    const densitya = a.mappings.reduce((acc, m) => acc + m.stop - m.start + 1, 0)
    const densityb = b.mappings.reduce((acc, m) => acc + m.stop - m.start + 1, 0)

    return starta - startb || densityb - densitya || a.interaction.id - b.interaction.id
}
