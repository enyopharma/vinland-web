import React from 'react'

export const InteractionTHead: React.FC = () => (
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
)
