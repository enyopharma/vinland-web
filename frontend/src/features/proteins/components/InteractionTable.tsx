import React from 'react'

import { Protein, Interaction, Mapping } from 'features/proteins'
import { ProteinLink, InteractionLink } from 'pages/partials'

type Props = {
    type: 'h' | 'v'
    width: number
    interactions: Interaction[]
}

const limit = 20

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

export const InteractionTable: React.FC<Props> = ({ type, width, interactions }) => {
    return (
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
                {interactions.sort(sorti).slice(0, limit).map(interaction => (
                    <React.Fragment>
                        <tr key={0}>
                            <Cell interaction={interaction} classes="text-center">
                                <InteractionLinkImg interaction={interaction} />
                                &nbsp;
                                <ProteinLinkImg protein={interaction.protein} />
                            </Cell>
                            <Cell interaction={interaction} classes="text-center">
                                <ProteinLinkAccession protein={interaction.protein} />
                            </Cell>
                            <Cell interaction={interaction} classes="text-center">
                                <ProteinLinkName protein={interaction.protein} />
                            </Cell>
                            <Cell interaction={interaction} classes="text-center" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '10px' }}>
                                <span title={interaction.protein.taxon}>
                                    {interaction.protein.taxon}
                                </span>
                            </Cell>
                            <Cell interaction={interaction} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '10px' }}>
                                <span title={interaction.protein.description}>
                                    {interaction.protein.description}
                                </span>
                            </Cell>
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
                ))}
            </tbody>
        </table >
    )
}

const Cell: React.FC<{ interaction: Interaction, classes?: string, style?: object }> = ({ interaction, classes = '', style = {}, children }) => {
    return interaction.mappings.length > 1
        ? <td className={classes} style={style} rowSpan={interaction.mappings.length}>{children}</td>
        : <td className={classes} style={style}>{children}</td>
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
