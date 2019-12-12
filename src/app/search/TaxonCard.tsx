import React from 'react'

import { TaxonSelection, Taxon } from './src/taxon'

import { TaxonInput } from './TaxonInput'

type Props = {
    taxon: TaxonSelection
    select: (taxon: Taxon) => void
    unselect: () => void
}

export const TaxonCard: React.FC<Props> = ({ taxon, select, unselect }) => (
    <div className="card">
        <div className="card-body">
            <TaxonInput taxon={taxon} select={select} unselect={unselect} />
        </div>
    </div>
)
