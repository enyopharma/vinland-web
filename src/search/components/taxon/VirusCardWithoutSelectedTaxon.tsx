import React from 'react'

import { Taxon } from 'search/state/taxon'

import { TaxonInput } from './TaxonInput'

type Props = {
    select: (taxon: Taxon) => void
}

export const VirusCardWithoutSelectedTaxon: React.FC<Props> = ({ select }) => (
    <div className="card">
        <div className="card-body">
            <TaxonInput select={select} />
        </div>
    </div>
)
