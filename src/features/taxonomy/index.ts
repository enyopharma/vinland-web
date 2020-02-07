export type Taxonomy = {
    taxon: Taxon | null
    names: Name[]
}

export type Taxon = {
    readonly ncbi_taxon_id: number
    readonly name: string
    readonly nb_interactions: number
}

export type Name = string

export type RelatedTaxa = {
    readonly parent: Taxon | null
    readonly children: Taxon[]
}

export { resources } from './api'
export { reducer, actions } from './reducer'
export { TaxonomyCard } from './components/TaxonomyCard'
