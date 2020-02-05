import React from 'react'

import { Interaction } from 'search/features/query'

type Props = {
    interactions: Interaction[]
    limit: number
}

type TrProps = {
    interaction: Interaction
}

export const InteractionTable: React.FC<Props> = ({ interactions, limit }) => (
    <table className="table card-striped table-stripped table-hover">
        <thead>
            <tr>
                <th className="col-1 text-center">
                    -
                </th>
                <th className="col-2 text-center" colSpan={2}>
                    Interactor 1
                </th>
                <th className="col-2 text-center" colSpan={2}>
                    Interactor 2
                </th>
                <th className="col-8 text-center">
                    Taxon
                </th>
            </tr>
        </thead>
        <tbody>
            {[...Array(limit - 1)].map((_, i) => interactions[i]
                ? <InteractionTr key={i} interaction={interactions[i]} />
                : <SkeletonTr key={i} />
            )}
        </tbody>
    </table>
)

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

const InteractionTr: React.FC<TrProps> = ({ interaction }) => (
    <tr>
        <td className="text-center">
            <a href="/" style={{ textDecoration: 'none' }}>
                <img
                    src={`/img/${interaction.type}.png`}
                    alt={`${interaction.type.toUpperCase()} interaction`}
                    style={{ maxWidth: '1em' }}
                />
            </a>
        </td>
        <td className="text-center">
            <a href="/" className="text-info">
                {interaction.protein1.accession}
            </a>
        </td>
        <td className="text-center">
            {interaction.protein1.name}
        </td>
        <td className="text-center">
            <a href="/" className={interaction.protein2.type === 'h' ? 'text-info' : 'text-danger'}>
                {interaction.protein2.accession}
            </a>
        </td>
        <td className="text-center">
            {interaction.protein2.name}
        </td>
        <td className="text-center" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
        }}>
            <span title={interaction.protein2.taxon.name}>
                {interaction.protein2.taxon.name}
            </span>
        </td>
    </tr>
)
