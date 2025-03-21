import { AppState } from 'app/store'

export type PageState = AppState['pages']

export type Stats = {
    hh: {
        descriptions: number
        interactions: number
        publications: number
    }
    vh: {
        descriptions: number
        interactions: number
        publications: number
    }
}

export type SearchState = {
    type: '' | 'h' | 'v'
    query: string
}

export type Resource<T> = {
    read: () => T
}

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
    protein_id: number
    accession: string
    is_canonical: boolean
    is_mature: boolean
    sequence: string
    start: number
    stop: number
}

export type Interactor = {
    interaction: Interaction
    protein: Protein
    mappings: Mapping[]
}

export type Interaction = {
    id: number
    type: 'hh' | 'vh'
    protein1_id: number
    protein2_id: number
}

export type Description = {
    id: number
    publication: {
        pmid: number
        title: string
        year: number
    }
    method: {
        psimi_id: string
        name: string
        is_binary: boolean
    }
    mappings: Mapping[]
}

export type Mapping = {
    sequence_id: number
    start: number
    stop: number
    sequence: string
}

export type Feature = {
    type: string
    description: string
    sequence: string
    start: number
    stop: number
}

export type Mappable = {
    start: number
    stop: number
    sequence: string
}

export type TargetingSequence = {
    sequence: string
    interaction: {
        type: 'hh' | 'vh'
        id: number
    }
    source: {
        type: 'h' | 'v'
        id: number
        accession: string
        name: string
        ncbi_taxon_id: number
        taxon: string
    }
}

export type Mature = {
    name: string
    proteins: Array<{ id: number, accession: string }>
}
