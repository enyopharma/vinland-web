import React from 'react'

import { Taxon } from 'search/state/taxon'

import { VirusCardWithSelectedTaxon } from './VirusCardWithSelectedTaxon'
import { VirusCardWithoutSelectedTaxon } from './VirusCardWithoutSelectedTaxon'

type Props = {
    taxon: Taxon | null
    select: (taxon: Taxon) => void
    unselect: () => void
}

export const VirusCard: React.FC<Props> = ({ taxon, select, unselect }) => {
    return taxon === null
        ? <VirusCardWithoutSelectedTaxon select={select} />
        : <VirusCardWithSelectedTaxon taxon={taxon} unselect={unselect} />
}
