import React from 'react'

import { Interaction } from 'features/query'

const limit = 20

type Props = {
    interactions: Interaction[]
    offset: number
    setOffset: (offset: number) => void
}

type TrProps = {
    interaction: Interaction
}

export const ListCardBody: React.FC<Props> = ({ interactions, offset, setOffset }) => {
    const slice = interactions.slice(offset, offset + limit);

    return (
        <table className="table card-table table-stripped table-hover">
            <thead>
                <tr>
                    <th className="col-1 text-center">
                        -
                        </th>
                    <th className="col-2 text-center" colSpan={2}>
                        Protein 1
                        </th>
                    <th className="col-2 text-center" colSpan={2}>
                        Protein 2
                        </th>
                    <th className="col-8 text-center">
                        Taxon
                        </th>
                </tr>
            </thead>
            <tbody>
                {[...Array(limit - 1)].map((_, i) => slice[i]
                    ? <InteractionTr key={i} interaction={slice[i]} />
                    : <SkeletonTr key={i} />
                )}
            </tbody>
        </table>
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
