import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force'
import { cache } from './cache'
import { network } from './network'

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

export interface Node extends SimulationNodeDatum {
    id: string,
    data: {
        type: Protein['type']
        name: string
        color: string
        species: string
        proteins: Record<string, Protein>
    },
    selection: {
        current?: number
        neighborhood?: number
    },
}

export interface Link extends SimulationLinkDatum<Node> {
    source: Node
    target: Node
    selection: {
        neighborhood?: number
    }
}

export type Network = ReturnType<typeof network>

export type ResultTab = 'interactions' | 'proteins' | 'network'

export type ProteinTab = 'a' | 'h' | 'v'
