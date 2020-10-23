export type Protein = {
    id: number
    type: 'h' | 'v'
    accession: string
    name: string
    description: string
    taxon: string
}

export type Isoform = {
    id: number
    accession: string
    is_canonical: boolean
    is_mature: boolean
    sequence: string
    start: number
    stop: number
}

export type Interaction = {
    id: number,
    type: 'hh' | 'vh'
    protein: Protein
    nb_mappings: number
    mappings: Mapping[]
}

export type Mapping = {
    start: number
    stop: number
    identity: number
    sequence: string
}
