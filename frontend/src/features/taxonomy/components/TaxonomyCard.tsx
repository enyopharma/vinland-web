import React from 'react'

import { useActionCreator } from 'app/hooks'
import { ProgressBar } from 'app/partials'

import { resources } from '../api'
import { actions } from '../reducer'
import { Taxonomy, Taxon, Name } from '../types'

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

const CardWithoutSelectedTaxon: React.FC = () => (
    <div className="card">
        <div className="card-body">
            <TaxonInput />
        </div>
    </div>
)

type CardWithoutSelectedTaxonProps = {
    taxon: Taxon
    names: Name[]
}

const CardWithSelectedTaxon: React.FC<CardWithoutSelectedTaxonProps> = ({ taxon, names }) => {
    const unselect = useActionCreator(actions.unselect)

    return (
        <div className="card">
            <div className="card-body">
                <div className="alert alert-danger">
                    {taxon.name}
                    <button type="button" className="close" onClick={unselect}>
                        &times;
                    </button>
                </div>
                <React.Suspense fallback={<ProgressBar type="danger" />}>
                    <h4>Browse taxonomy:</h4>
                    <RelatedFormRowFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} />
                    <h4>Only protein tagged with:</h4>
                    <NameListFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} selected={names} />
                </React.Suspense>
            </div>
        </div>
    )
}

type RelatedFormRowFetcherProps = {
    ncbi_taxon_id: number
}

const RelatedFormRowFetcher: React.FC<RelatedFormRowFetcherProps> = ({ ncbi_taxon_id }) => {
    const { parent, children } = resources.related(ncbi_taxon_id).read()

    return <RelatedFormRow parent={parent} children={children} />
}

type NameListFetcherProps = {
    ncbi_taxon_id: number
    selected: Name[]
}

const NameListFetcher: React.FC<NameListFetcherProps> = ({ ncbi_taxon_id, selected }) => {
    const names = resources.names(ncbi_taxon_id).read()

    return <NameList names={names} selected={selected} />
}
