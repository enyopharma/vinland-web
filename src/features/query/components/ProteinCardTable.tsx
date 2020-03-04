import React from 'react'

import { Protein } from 'features/query'
import { config } from 'features/query'

type Props = {
    proteins: Protein[]
}

export const ProteinCardTable: React.FC<Props> = ({ proteins }) => (
    <table className="table card-table table-stripped table-hover">
        <thead>
            <tr>
                <th className="col-1 text-center">
                    -
                        </th>
                <th className="col-2 text-center">
                    accession
                        </th>
                <th className="col-2 text-center">
                    name
                        </th>
                <th className="col-8 text-center">
                    Taxon
                        </th>
            </tr>
        </thead>
        <tbody>
            {[...Array(config.limit)].map((_, i) => proteins[i]
                ? <ProteinTr key={i} protein={proteins[i]} />
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
    </tr>
)

const ProteinTr: React.FC<{ protein: Protein }> = ({ protein }) => (
    <tr>
        <td className="text-center">
            <a href="/" style={{ textDecoration: 'none' }}>
                <img
                    src={`/img/${protein.type}.png`}
                    alt={`${protein.type.toUpperCase()} protein`}
                    style={{ maxWidth: '1em' }}
                />
            </a>
        </td>
        <td className="text-center">
            <a href="/" className={protein.type === 'h' ? 'text-info' : 'text-danger'}>
                {protein.accession}
            </a>
        </td>
        <td className="text-center">
            {protein.name}
        </td>
        <td className="text-center" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
        }}>
            <span title={protein.taxon.name}>
                {protein.taxon.name}
            </span>
        </td>
    </tr>
)
