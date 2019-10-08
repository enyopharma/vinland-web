import React from 'react'

import { Interaction } from 'form/types'

type Props = {
    interactions: Interaction[]
}

export const InteractionTable: React.FC<Props> = ({ interactions }) => {
    return (
        <table className="table table-striped table-hover">
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
                {interactions.map((interaction, i) => (
                    <tr key={i}>
                        <td className="text-center">
                            <a
                                href="#"
                                style={{ textDecoration: 'none' }}
                                title={interaction.type.toUpperCase() + ' interaction'}
                            >
                                <img
                                    src={['/img/interactions/', interaction.type, '.png'].join('')}
                                    style={{ maxWidth: '1em' }}
                                />
                            </a>
                        </td>
                        <td className="text-center">
                            <a href="#" className="text-info">
                                {interaction.protein1.accession}
                            </a>
                        </td>
                        <td className="text-center">
                            {interaction.protein1.name}
                        </td>
                        <td className="text-center">
                            <a href="#" className={interaction.protein2.type == 'h' ? 'text-info' : 'text-danger'}>
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
                ))}
            </tbody>
        </table>
    )
}
