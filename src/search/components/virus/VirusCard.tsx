import React from 'react'

import { Taxon, Name, TaxonSelection, isSelectedTaxon } from 'search/state/virus'

import { TaxonInput } from './TaxonInput'
import { NameList } from './NameList'

type Props = {
    taxon: TaxonSelection
    names: Name[]
    selectTaxon: (taxon: Taxon) => void
    unselectTaxon: () => void
    updateNames: (names: Name[]) => void
}

export const VirusCard: React.FC<Props> = ({ taxon, names, selectTaxon, unselectTaxon, updateNames }) => (
    <div className="card">
        <div className="card-body">
            <TaxonInput taxon={taxon} select={selectTaxon} unselect={unselectTaxon} />
            <hr />
            <h4>Viral protein name</h4>
            {!isSelectedTaxon(taxon)
                ? <p>Please select a viral taxon first.</p>
                : <NameList names={taxon.names} selected={names} update={updateNames} />
            }
        </div>
    </div>
)
