import { AppState } from 'app/store'

export type PageState = AppState['proteins']

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
    accession: string
    is_canonical: boolean
    is_mature: boolean
    sequence: string
    start: number
    stop: number
}

export type Interaction = {
    id: number
    type: 'hh' | 'vh'
}

export type Interactor = {
    interaction: Interaction
    protein: Protein
    mappings: Mapping[]
    nb_mappings: number
}

export type Mapping = {
    start: number
    stop: number
    identity: number
    sequence: string
}
