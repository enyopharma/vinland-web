import React from 'react'

import { ProteinLink } from 'partials'

import { Protein } from '../types'

type ProteinTableProps = {
    proteins: Protein[]
}

export const ProteinTable: React.FC<ProteinTableProps> = ({ proteins }) => (
    <table className="table card-table table-striped table-hover">
        <thead>
            <tr>
                <th className="text-center">-</th>
                <th className="text-center" style={{ width: '16%' }}>Accession</th>
                <th className="text-center" style={{ width: '16%' }}>Name</th>
                <th className="text-center" style={{ width: '24%' }}>Taxon</th>
                <th className="text-center" style={{ width: '32%' }}>Description</th>
            </tr>
        </thead>
        <tbody>
            {proteins.map((protein, i) => (
                <tr key={i}>
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
                        <ProteinLink {...protein}>
                            <span className={protein.type === 'h' ? 'text-info' : 'text-danger'}>
                                {protein.accession}
                            </span>
                        </ProteinLink>
                    </td>
                    <td className="text-center">
                        {protein.name}
                    </td>
                    <td className="text-center ellipsis">
                        <span title={protein.taxon}>
                            {protein.taxon}
                        </span>
                    </td>
                    <td className="text-center ellipsis">
                        <span title={protein.description}>
                            {protein.description}
                        </span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)
