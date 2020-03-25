export type Protein = {
    id: number
    type: 'h' | 'v'
    ncbi_taxon_id: number
    accession: string
    name: string
    description: string
    taxon: string
}
