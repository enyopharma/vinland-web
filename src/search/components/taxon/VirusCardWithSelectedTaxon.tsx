import React, { Suspense } from 'react'

import { Taxon } from 'search/state/taxon'
import { ConnectedNameList } from './name/ConnectedNameList'
import { ConnectedRelatedFormRow } from './related/ConnectedRelatedFormRow'

type Props = {
    taxon: Taxon
    unselect: () => void
}

const SelectedTaxonCardBodyLoader: React.FC = () => (
    <div className="card-body">
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                style={{ width: '100%' }}
            ></div>
        </div>
    </div>
)

export const VirusCardWithSelectedTaxon: React.FC<Props> = ({ taxon, unselect }) => (
    <div className="card">
        <div className="card-body">
            <div className="alert alert-danger">
                {taxon.name}
                <button type="button" className="close" onClick={e => unselect()}>
                    &times;
                </button>
            </div>
            <Suspense fallback={<SelectedTaxonCardBodyLoader />}>
                <h4>Browse taxonomy:</h4>
                <ConnectedRelatedFormRow ncbi_taxon_id={taxon.ncbi_taxon_id} />
                <h4>Only protein tagged with:</h4>
                <ConnectedNameList ncbi_taxon_id={taxon.ncbi_taxon_id} />
            </Suspense>
        </div>
    </div>
)
