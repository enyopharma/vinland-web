import React from 'react'

import { Protein } from 'features/proteins'

import { ProteinLink } from 'pages/partials'

type Props = {
    proteins: Protein[]
}

const style = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    maxWidth: '10px',
}

export const ProteinCardTable: React.FC<Props> = ({ proteins }) => (
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
                        <ProteinLink {...protein} target="_blank">
                            <img
                                src={`/img/${protein.type}.png`}
                                alt={`${protein.type.toUpperCase()} protein`}
                                style={{ maxWidth: '1em' }}
                            />
                        </ProteinLink>
                    </td>
                    <td className="text-center">
                        <ProteinLink {...protein} target="_blank">
                            {protein.accession}
                        </ProteinLink>
                    </td>
                    <td className="text-center">
                        {protein.name}
                    </td>
                    <td className="text-center" style={style}>
                        <span title={protein.taxon}>
                            {protein.taxon}
                        </span>
                    </td>
                    <td className="text-center" style={style}>
                        <span title={protein.description}>
                            {protein.description}
                        </span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)
