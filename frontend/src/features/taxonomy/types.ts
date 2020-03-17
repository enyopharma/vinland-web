export type Taxonomy = {
    taxon: Taxon | null
    names: Name[]
}

export type Taxon = {
    ncbi_taxon_id: number
    name: string
    nb_interactions: number
}

export type Name = string

export type RelatedTaxa = {
    parent: Taxon | null
    children: Taxon[]
}
