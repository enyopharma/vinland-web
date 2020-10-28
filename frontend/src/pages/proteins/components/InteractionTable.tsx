import React, { useState } from 'react'

import { Pagination, ProteinLink, InteractionLink } from 'app/partials'

import { Protein, Interaction, Mapping } from '../types'

const limit = 10

type Props = {
    type: 'h' | 'v'
    width: number
    interactions: Interaction[]
}

export const InteractionTable: React.FC<Props> = ({ type, width, interactions }) => {
    const [offset, setOffset] = useState<number>(0)

    const slice = interactions.sort(sorti).slice(offset, offset + limit)

    return (
        <React.Fragment>
            <div className="row">
                <div className="col">
                    <Pagination
                        offset={offset}
                        total={interactions.length}
                        limit={limit}
                        update={setOffset}
                    />
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-1 text-center">-</th>
                        <th className="col-1 text-center">Accession</th>
                        <th className="col-1 text-center">Name</th>
                        <th className="col-2 text-center">Taxon</th>
                        <th className="col-3 text-center">Description</th>
                        <th className="col-4 text-center">Mapping</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(limit)].map((_, i) => slice[i]
                        ? <InteractionTr key={i} type={type} width={width} interaction={slice[i]} />
                        : <SkeletonTr key={i} />
                    )}
                </tbody>
            </table>
            <div className="row">
                <div className="col">
                    <Pagination
                        offset={offset}
                        total={interactions.length}
                        limit={limit}
                        update={setOffset}
                    />
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
    width: number
    interaction: Interaction
}

const InteractionTr: React.FC<InteractionTrProps> = ({ type, width, interaction }) => {
    const clx = clusters(interaction.mappings)

    const rowspan = clx.length > 1 ? clx.length : undefined

    return (
        <React.Fragment>
            <tr key={0}>
                <td className="text-center" rowSpan={rowspan}>
                    <InteractionLinkImg interaction={interaction} />
                    &nbsp;
                    <ProteinLinkImg protein={interaction.protein} />
                </td>
                <td className="text-center" rowSpan={rowspan}>
                    <ProteinLinkAccession protein={interaction.protein} />
                </td>
                <td className="text-center" rowSpan={rowspan}>
                    <ProteinLinkName protein={interaction.protein} />
                </td>
                <td className="text-center ellipsis" rowSpan={rowspan}>
                    <span title={interaction.protein.taxon}>
                        {interaction.protein.taxon}
                    </span>
                </td>
                <td className="ellipsis" rowSpan={rowspan}>
                    <span title={interaction.protein.description}>
                        {interaction.protein.description}
                    </span>
                </td>
                <td className="text-center">
                    {clx.length > 0 && <MappingImg type={type} width={width} mappings={clx[0]} />}
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

type InteractionLinkImgProps = {
    interaction: Interaction
}

const InteractionLinkImg: React.FC<InteractionLinkImgProps> = ({ interaction }) => (
    <InteractionLink {...interaction}>
        <img
            src={`/img/${interaction.type}.png`}
            alt={`${interaction.type.toUpperCase()} interaction`}
            style={{ maxWidth: '1em' }}
        />
    </InteractionLink>
)

type ProteinLinkImgProps = {
    protein: Protein
}

const ProteinLinkImg: React.FC<ProteinLinkImgProps> = ({ protein }) => (
    <ProteinLink {...protein}>
        <img
            src={`/img/${protein.type}.png`}
            alt={`${protein.accession} - ${protein.name}`}
            style={{ maxWidth: '1em' }}
        />
    </ProteinLink>
)

type ProteinLinkAccessionProps = {
    protein: Protein
}

const ProteinLinkAccession: React.FC<ProteinLinkAccessionProps> = ({ protein }) => {
    const classes = protein.type === 'h' ? 'text-info' : 'text-danger'

    return (
        <ProteinLink {...protein}>
            <span className={classes}>{protein.accession}</span>
        </ProteinLink>
    )
}

type ProteinLinkNameProps = {
    protein: Protein
}

const ProteinLinkName: React.FC<ProteinLinkNameProps> = ({ protein }) => {
    const classes = protein.type === 'h' ? 'text-info' : 'text-danger'

    return (
        <ProteinLink {...protein}>
            <span className={classes}>{protein.name}</span>
        </ProteinLink>
    )
}

type MappingImgProps = {
    type: 'h' | 'v'
    width: number
    mappings: Mapping[]
}

const MappingImg: React.FC<MappingImgProps> = ({ type, width, mappings }) => (
    <svg width="100%" height="30">
        <rect width="100%" y="14" height="2" style={{ fill: '#eee', strokeWidth: 0 }} />
        {mappings.map((mapping, i) => <MappingRect key={i} type={type} width={width} mapping={mapping} />)}
    </svg>
)

type MappingRectProps = {
    type: 'h' | 'v'
    width: number
    mapping: Mapping
}

const MappingRect: React.FC<MappingRectProps> = ({ type, width, mapping }) => {
    const color = type === 'h' ? '#6CC3D5' : '#FF7851'
    const startp = ((mapping.start / width) * 100) + '%'
    const stopp = ((mapping.stop / width) * 100) + '%'
    const widthp = (((mapping.stop - mapping.start + 1) / width) * 100) + '%'

    return (
        <React.Fragment>
            <text x={startp} y="10" textAnchor="start" style={{ fontSize: '10px' }}>
                {mapping.start}
            </text>
            <text x={stopp} y="30" textAnchor="end" style={{ fontSize: '10px' }}>
                {mapping.stop}
            </text>
            <rect width={widthp} x={startp} y="13" height="4" style={{ fill: color, strokeWidth: 0 }} />
        </React.Fragment>
    )
}

const sorti = (a: Interaction, b: Interaction) => {
    // 1. whether one interaction has mapping on at least one isoform and not the other
    //    -> prevents from changing order form an isoform to another
    if (a.nb_mappings > 0 && b.nb_mappings === 0) return -1;
    if (a.nb_mappings === 0 && b.nb_mappings > 0) return +1;

    // 2. min interaction id when no interaction has mapping
    if (a.mappings.length === 0 && b.mappings.length === 0) return a.id - b.id

    // 3. whether one interaction has mapping on the current isoform and not the other
    if (a.mappings.length > 0 && b.mappings.length === 0) return -1
    if (a.mappings.length === 0 && b.mappings.length > 0) return +1

    // 4. when both interaction has mapping the order is:
    //    - min start
    //    - max density
    //    - min interaction id
    const starta = Math.min(...a.mappings.map(mapping => mapping.start))
    const startb = Math.min(...b.mappings.map(mapping => mapping.start))
    const densitya = a.mappings.reduce((acc, m) => acc + m.stop - m.start + 1, 0)
    const densityb = b.mappings.reduce((acc, m) => acc + m.stop - m.start + 1, 0)

    return starta - startb || densityb - densitya || a.id - b.id
}

const clusters = (mappings: Mapping[]): Array<Mapping[]> => {
    if (mappings.length === 0) return []

    const curr = []
    const rest = []

    const sorted = mappings.sort((a, b) => a.start - b.start)

    let laststop = 0

    for (let i = 0; i < mappings.length; i++) {
        if (sorted[i].start > laststop) {
            curr.push(sorted[i])
            laststop = sorted[i].stop
        } else {
            rest.push(sorted[i])
        }
    }

    return rest.length > 0 ? [curr].concat(clusters(rest)) : [curr]
}
