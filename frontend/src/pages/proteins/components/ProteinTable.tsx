import React from 'react'

import { ProteinLink } from 'app/partials'

import { Protein } from '../types'

type ProteinTableProps = {
    proteins: Protein[]
}

export const ProteinTable: React.FC<ProteinTableProps> = ({ proteins }) => (
    <table className="table card-table table-striped table-hover">
        <thead>
            <tr>
                <th className="col-1 text-center">-</th>
                <th className="col-2 text-center">Accession</th>
                <th className="col-2 text-center">Name</th>
                <th className="col-3 text-center">Taxon</th>
                <th className="col-4 text-center">Description</th>
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
