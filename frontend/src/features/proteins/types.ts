export type Protein = {
    id: number
    type: 'h' | 'v'
    accession: string
    name: string
    description: string
    taxon: string
    isoforms: Isoform[]
}

export type Isoform = {
    id: number
    accession: string
    sequence: string
    is_canonical: boolean
    interactions: {
        hh: Interaction[]
        vh: Interaction[]
    }
}

export type Interaction = {
    id: number,
    type: 'hh' | 'vh'
    protein: Protein
    mappings: Mapping[]
}

export type Mapping = {
    start: number
    stop: number
    identity: number
    sequence: string
}
