import React from 'react'

import { Name } from 'features/taxonomy'
import { resources } from 'features/taxonomy'
import { ProgressBar } from 'pages/partials'

const NameList = React.lazy(() => import('./NameList').then(module => ({ default: module.NameList })))
const RelatedFormRow = React.lazy(() => import('./RelatedFormRow').then(module => ({ default: module.RelatedFormRow })))

type Props = {
    ncbi_taxon_id: number
    selected: Name[]
}

export const TaxonomyCardInfoSuspense: React.FC<Props> = (props) => (
    <React.Suspense fallback={<ProgressBar type="danger" />}>
        <Fetcher {...props} />
    </React.Suspense>
)

const Fetcher: React.FC<Props> = ({ ncbi_taxon_id, selected }) => {
    const { parent, children } = resources.related(ncbi_taxon_id).read()
    const names = resources.names(ncbi_taxon_id).read()

    return (
        <React.Fragment>
            <h4>Browse taxonomy:</h4>
            <RelatedFormRow parent={parent} children={children} />
            <h4>Only protein tagged with:</h4>
            <NameList names={names} selected={selected} />
        </React.Fragment>
    )
}
