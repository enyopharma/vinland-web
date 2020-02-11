export type Taxonomy = {
    readonly taxon: Taxon | null
    readonly names: Name[]
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

export * from './api'
export * from './reducer'
export * from './components/TaxonomyCard'
