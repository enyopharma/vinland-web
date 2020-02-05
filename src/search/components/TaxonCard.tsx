import React, { Suspense } from 'react'
import { useSelector, useActionCreator } from 'search/state'

import { Taxon } from 'search/features/taxonomy'

import { cache } from 'search/api/taxon'
import { creators } from 'search/features/taxonomy'

import { NameList } from './NameList'
import { TaxonInput } from './TaxonInput'
import { RelatedFormRow } from './RelatedFormRow'

type SelectedTaxonProps = {
    taxon: Taxon
}

type FetcherProps = {
    ncbi_taxon_id: number
}

const CardWithoutSelectedTaxon: React.FC = () => {
    const select = useActionCreator(creators.select)

    return (
        <div className="card">
            <div className="card-body">
                <TaxonInput select={select} />
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

const RelatedFormRowFetcher: React.FC<FetcherProps> = ({ ncbi_taxon_id }) => {
    const { parent, children } = cache.read(ncbi_taxon_id).related()

    return <RelatedFormRow parent={parent} children={children} />
}

const NameListFetcher: React.FC<FetcherProps> = ({ ncbi_taxon_id }) => {
    const names = cache.read(ncbi_taxon_id).names()

    return <NameList names={names} />
}

const CardWithSelectedTaxon: React.FC<SelectedTaxonProps> = ({ taxon }) => {
    const unselect = useActionCreator(creators.unselect)

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
                    <NameListFetcher ncbi_taxon_id={taxon.ncbi_taxon_id} />
                </Suspense>
            </div>
        </div>
    )
}

export const TaxonCard: React.FC = () => {
    const taxon = useSelector(search => search.taxonomy.taxon)

    return taxon === null
        ? <CardWithoutSelectedTaxon />
        : <CardWithSelectedTaxon taxon={taxon} />
}
