import React from 'react'

import { TaxonSelection, Taxon, isSelectedTaxon } from './src/taxon'
import { Name } from './src/name'

import { TaxonInput } from './TaxonInput'
import { NameList } from './NameList'

type Props = {
    taxon: TaxonSelection
    select: (taxon: Taxon) => void
    unselect: () => void
    updateNames: (names: Name[]) => void
}

export const TaxonCard: React.FC<Props> = ({ taxon, select, unselect, updateNames }) => (
    <div className="card">
        <div className="card-body">
            <TaxonInput taxon={taxon} select={select} unselect={unselect} />
            <hr />
            <h4>Viral protein name</h4>
            {!isSelectedTaxon(taxon)
                ? <p>Please select a viral taxon first.</p>
                : <NameList names={taxon.names} update={updateNames} />
            }
        </div>
    </div>
)
