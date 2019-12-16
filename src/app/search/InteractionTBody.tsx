import React from 'react'

import { Interaction } from './src/interaction'

type Props = {
    interactions: Interaction[]
    limit: number
}

const InteractionTr: React.FC<{ interaction: Interaction }> = ({ interaction }) => (
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
            <span title={interaction.protein2.taxon}>
                {interaction.protein2.taxon}
            </span>
        </td>
    </tr>
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

export const InteractionTBody: React.FC<Props> = ({ interactions, limit }) => {
    return (
        <tbody>
            {[...Array(limit - 1)].map((_, i) => interactions[i]
                ? <InteractionTr key={i} interaction={interactions[i]} />
                : <SkeletonTr key={i} />
            )}
        </tbody>
    )
}
