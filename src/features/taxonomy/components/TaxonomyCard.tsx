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

type SelectedTaxonProps = {
    taxon: Taxon
    names: Name[]
}

type RelatedFormRowProps = {
    ncbi_taxon_id: number
}

type NameListProps = {
    ncbi_taxon_id: number
    selected: Name[]
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

const CardWithSelectedTaxon: React.FC<SelectedTaxonProps> = ({ taxon, names }) => {
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
                <Suspense fallback={<ProgressBar />}>
                    <h4>Browse taxonomy:</h4>
                    <RelatedFormRowFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} />
                    <h4>Only protein tagged with:</h4>
                    <NameListFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} selected={names} />
                </Suspense>
            </div>
        </div>
    )
}

const ProgressBar: React.FC = () => (
    <div className="progress">
        <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
            style={{ width: '100%' }}
        ></div>
    </div>
)

const RelatedFormRowFetcher: React.FC<RelatedFormRowProps> = ({ ncbi_taxon_id }) => {
    const { parent, children } = resources.related(ncbi_taxon_id).read()

    return <RelatedFormRow parent={parent} children={children} />
}

const NameListFetcher: React.FC<NameListProps> = ({ ncbi_taxon_id, selected }) => {
    const names = resources.names(ncbi_taxon_id).read()

    return <NameList names={names} selected={selected} />
}
