import React, { useState } from 'react'

import { Pagination, ProteinLink, InteractionLink } from 'partials'

import { Protein, Interaction, Mapping } from '../types'

const limit = 20

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

const InteractionTr: React.FC<{ type: 'h' | 'v', width: number, interaction: Interaction }> = (props) => {
    const { type, width, interaction } = props

    return (
        <React.Fragment>
            <tr key={0}>
                <td className="text-center" rowSpan={rowspan(interaction)}>
                    <InteractionLinkImg interaction={interaction} />
                    &nbsp;
                    <ProteinLinkImg protein={interaction.protein} />
                </td>
                <td className="text-center" rowSpan={rowspan(interaction)}>
                    <ProteinLinkAccession protein={interaction.protein} />
                </td>
                <td className="text-center" rowSpan={rowspan(interaction)}>
                    <ProteinLinkName protein={interaction.protein} />
                </td>
                <td className="text-center ellipsis" rowSpan={rowspan(interaction)}>
                    <span title={interaction.protein.taxon}>
                        {interaction.protein.taxon}
                    </span>
                </td>
                <td className="ellipsis" rowSpan={rowspan(interaction)}>
                    <span title={interaction.protein.description}>
                        {interaction.protein.description}
                    </span>
                </td>
                <td className="text-center">
                    {interaction.mappings.length > 0 && (
                        <MappingImg type={type} width={width} mapping={interaction.mappings.sort(sortm)[0]} />
                    )}
                </td>
            </tr>
            {interaction.mappings.sort(sortm).slice(1).map((mapping, m) => (
                <tr key={m + 1}>
                    <td className="text-center">
                        <MappingImg type={type} width={width} mapping={mapping} />
                    </td>
                </tr>
            ))}
        </React.Fragment>
    )
}

const InteractionLinkImg: React.FC<{ interaction: Interaction }> = ({ interaction }) => {
    return (
        <InteractionLink {...interaction}>
            <img
                src={`/img/${interaction.type}.png`}
                alt={`${interaction.type.toUpperCase()} interaction`}
                style={{ maxWidth: '1em' }}
            />
        </InteractionLink>
    )
}

const ProteinLinkImg: React.FC<{ protein: Protein }> = ({ protein }) => {
    return (
        <ProteinLink {...protein}>
            <img
                src={`/img/${protein.type}.png`}
                alt={`${protein.accession} - ${protein.name}`}
                style={{ maxWidth: '1em' }}
            />
        </ProteinLink>
    )
}

const ProteinLinkAccession: React.FC<{ protein: Protein }> = ({ protein }) => {
    const classes = protein.type === 'h' ? 'text-info' : 'text-danger'

    return (
        <ProteinLink {...protein}>
            <span className={classes}>{protein.accession}</span>
        </ProteinLink>
    )
}

const ProteinLinkName: React.FC<{ protein: Protein }> = ({ protein }) => {
    const classes = protein.type === 'h' ? 'text-info' : 'text-danger'

    return (
        <ProteinLink {...protein}>
            <span className={classes}>{protein.name}</span>
        </ProteinLink>
    )
}

const MappingImg: React.FC<{ type: 'h' | 'v', width: number, mapping: Mapping }> = ({ type, width, mapping }) => {
    const color = type === 'h' ? '#6CC3D5' : '#FF7851'
    const startp = ((mapping.start / width) * 100) + '%'
    const stopp = ((mapping.stop / width) * 100) + '%'
    const widthp = (((mapping.stop - mapping.start + 1) / width) * 100) + '%'

    return (
        <svg width="100%" height="30">
            <text x={startp} y="10" textAnchor="start" style={{ fontSize: '10px' }}>
                {mapping.start}
            </text>
            <text x={stopp} y="30" textAnchor="end" style={{ fontSize: '10px' }}>
                {mapping.stop}
            </text>
            <rect width="100%" y="14" height="2" style={{ fill: '#eee', strokeWidth: 0 }} />
            <rect width={widthp} x={startp} y="13" height="4" style={{ fill: color, strokeWidth: 0 }} />
        </svg>
    )
}

const sorti = (a: Interaction, b: Interaction) => {
    if (a.mappings.length > 0 && b.mappings.length === 0) {
        return -1
    }

    if (a.mappings.length === 0 && b.mappings.length > 0) {
        return +1
    }

    const starta = Math.min(...a.mappings.map(mapping => mapping.start))
    const startb = Math.min(...b.mappings.map(mapping => mapping.start))

    return starta - startb || b.mappings.length - a.mappings.length
}

const sortm = (a: Mapping, b: Mapping) => {
    return a.start - b.start || (a.stop - a.start) - (b.stop - a.stop)
}

const rowspan = (interaction: Interaction) => {
    return interaction.mappings.length > 1
        ? interaction.mappings.length
        : undefined
}
