import { store } from './store'
import { cache } from './cache'
import { network } from './network'

export type SearchState = ReturnType<typeof store.getState>

export type SearchDispatch = typeof store.dispatch

export type SearchResult<T> = {
    label: string
    value: T
}

export type Annotation = {
    source: string
    ref: string
    name: string
    accessions: string[]
}

export type IdentifierList = {
    i: number
    name: string
    identifiers: string
}

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

export type DisplayOptions = {
    hh: boolean
    vh: boolean
    neighbors: boolean
    publications: number
    methods: number
}

export type ResultTab = 'interactions' | 'proteins' | 'network'

export type ProteinTab = 'a' | 'h' | 'v'

export type Query = {
    key: string
    identifiers: string[]
    ncbi_taxon_id: number
    names: string[]
    hh: boolean
    vh: boolean
    neighbors: boolean
    publications: number
    methods: number
}

export type QueryResult =
    | IncompleteQueryResult
    | SuccessfulQueryResult
    | FailedQueryResult

export enum QueryResultStatuses {
    INCOMPLETE = 'incomplete',
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export interface IncompleteQueryResult {
    status: typeof QueryResultStatuses.INCOMPLETE
}

export interface SuccessfulQueryResult {
    status: typeof QueryResultStatuses.SUCCESS
    interactions: Interaction[]
}

export interface FailedQueryResult {
    status: typeof QueryResultStatuses.FAILURE
    errors: string[]
}

export type QueryResultCache = ReturnType<typeof cache>

export type Interaction = {
    id: number
    type: 'hh' | 'vh'
    protein1: Protein
    protein2: Protein
    publications: { nb: number }
    methods: { nb: number }
}

export type Protein = {
    id: number
    type: 'h' | 'v'
    accession: string
    name: string
    description: string
    taxon: {
        ncbi_taxon_id: number
        name: string
    }
    species: {
        ncbi_taxon_id: number
        name: string
    }
}

export type Network = ReturnType<typeof network>
