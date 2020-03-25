import React from 'react'

import { useActionCreator } from 'app'

import { Taxonomy, Taxon, Name } from 'features/taxonomy'
import { actions } from 'features/taxonomy'

import { TaxonInput } from './TaxonInput'
import { TaxonomyCardInfoSuspense } from './TaxonomyCardInfoSuspense'

type Props = {
    taxonomy: Taxonomy
}

export const TaxonomyCard: React.FC<Props> = ({ taxonomy }) => {
    return taxonomy.taxon === null
        ? <CardWithoutSelectedTaxon />
        : <CardWithSelectedTaxon taxon={taxonomy.taxon} names={taxonomy.names} />
}

const CardWithoutSelectedTaxon: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <TaxonInput />
        </div>
    </div>
)

const CardWithSelectedTaxon: React.FC<{ taxon: Taxon, names: Name[] }> = ({ taxon, names }) => {
    const unselect = useActionCreator(actions.unselect)

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-danger">
                    {taxon.name}
                    <button type="button" className="close" onClick={e => unselect()}>
                        &times;
                    </button>
                </div>
                <TaxonomyCardInfoSuspense ncbi_taxon_id={taxon.ncbi_taxon_id} selected={names} />
            </div>
        </div>
    )
}
