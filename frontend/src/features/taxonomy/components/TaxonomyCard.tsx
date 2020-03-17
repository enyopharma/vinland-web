import React, { Suspense } from 'react'

import { useActionCreator } from 'app'

import { Taxonomy, Taxon, Name } from 'features/taxonomy'
import { resources } from 'features/taxonomy'
import { actions } from 'features/taxonomy'

import { NameList } from './NameList'
import { TaxonInput } from './TaxonInput'
import { RelatedFormRow } from './RelatedFormRow'

type Props = {
    taxonomy: Taxonomy
}

export const TaxonomyCard: React.FC<Props> = ({ taxonomy }) => {
    return taxonomy.taxon === null
        ? <CardWithoutSelectedTaxon />
        : <CardWithSelectedTaxon taxon={taxonomy.taxon} names={taxonomy.names} />
}

const CardWithoutSelectedTaxon: React.FC = () => {
    const select = useActionCreator(actions.select)

    return (
        <div className="card">
            <div className="card-body">
                <TaxonInput select={select} />
            </div>
        </div>
    )
}

const CardWithSelectedTaxon: React.FC<{ taxon: Taxon, names: Name[] }> = (props) => {
    const { taxon, names } = props

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
                <Suspense fallback={<Fallback />}>
                    <h4>Browse taxonomy:</h4>
                    <RelatedFormRowFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} />
                    <h4>Only protein tagged with:</h4>
                    <NameListFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} selected={names} />
                </Suspense>
            </div>
        </div>
    )
}

const RelatedFormRowFetcher: React.FC<{ ncbi_taxon_id: number }> = ({ ncbi_taxon_id }) => {
    const { parent, children } = resources.related(ncbi_taxon_id).read()

    return <RelatedFormRow parent={parent} children={children} />
}

const NameListFetcher: React.FC<{ ncbi_taxon_id: number, selected: Name[] }> = ({ ncbi_taxon_id, selected }) => {
    const names = resources.names(ncbi_taxon_id).read()

    return <NameList names={names} selected={selected} />
}

const Fallback: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
            style={{ width: '100%' }}
        ></div>
    </div>
)
