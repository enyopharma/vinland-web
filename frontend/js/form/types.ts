/**
 * The whole app state.
 */
export type AppState = {
    mode: IdentifiersMode
    identifiers: string[]
    annotations: Annotation[]
    taxon: TaxonSelection
    names: string[]
    hh: HHOptions
    vh: VHOptions
    publications: PublicationsOptions
    methods: MethodsOptions
}

/**
 * Query type.
 */
export type Query = {
    human: {
        accessions: string[]
    }
    virus: {
        left: number
        right: number
        names: string[]
    }
    hh: {
        show: boolean
        network: boolean
    }
    vh: {
        show: boolean
    }
    publications: {
        threshold: number
    }
    methods: {
        threshold: number
    }
}

/**
 * The identifiers submission mode.
 */
export enum IdentifiersMode {
    manual = 'manual',
    annotations = 'annotations',
}

/**
 * Annotation related types.
 */
export type Annotation = {
    source: string
    ref: string
    name: string
    identifiers: string[]
}

/**
 * Taxon related types.
 */
export type Taxon = { left: number, right: number, name: string }

export type TaxonSelection = { left: 0, right: 0 } | Taxon

export function isSelectedTaxon(selection: TaxonSelection): selection is Taxon {
    return selection.left > 0 && selection.right > 0
}

/**
 * Filtering options related types.
 */
export type HHOptions = {
    show: boolean
    network: boolean
}

export type VHOptions = {
    show: boolean
}

export type PublicationsOptions = {
    threshold: number
}

export type MethodsOptions = {
    threshold: number
}

/**
 * Interaction related type.
 */
export enum InteractionTypes {
    HH = 'hh',
    VH = 'vh',
}

export enum InteractorTypes {
    H = 'h',
    V = 'v',
}

export type Interaction = {
    type: InteractionTypes
    protein1: Interactor
    protein2: Interactor
    publications: PublicationsMeta,
    methods: MethodsMeta
}

export type Interactor = {
    type: InteractorTypes
    accession: string
    name: string
    description: string
    taxon: string
}

export type PublicationsMeta = {
    nb: number
}

export type MethodsMeta = {
    nb: number
}
