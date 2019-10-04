import { Annotation } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'

export enum AppActionTypes {
    UPDATE_ACCESSIONS,
    ADD_ANNOTATION,
    UPDATE_ANNOTATION,
    REMOVE_ANNOTATION,
    SELECT_TAXON,
    UNSELECT_TAXON,
    UPDATE_HH_OPTIONS,
    UPDATE_VH_OPTIONS,
    UPDATE_PUBLICATIONS_OPTIONS,
    UPDATE_METHODS_OPTIONS,
}

export type AppAction =
    | UpdateAccessions
    | AddAnnotation
    | UpdateAnnotation
    | RemoveAnnotation
    | SelectTaxon
    | UnselectTaxon
    | UpdateHHOptions
    | UpdateVHOptions
    | UpdatePublicationsOptions
    | UpdateMethodsOptions

interface UpdateAccessions {
    type: typeof AppActionTypes.UPDATE_ACCESSIONS
    identifiers: string
}

interface AddAnnotation {
    type: typeof AppActionTypes.ADD_ANNOTATION
    annotation: Annotation
}

interface UpdateAnnotation {
    type: typeof AppActionTypes.UPDATE_ANNOTATION
    i: number
    identifiers: string
}

interface RemoveAnnotation {
    type: typeof AppActionTypes.REMOVE_ANNOTATION
    i: number
}

interface SelectTaxon {
    type: typeof AppActionTypes.SELECT_TAXON
    taxon: TaxonSelection
}

interface UnselectTaxon {
    type: typeof AppActionTypes.UNSELECT_TAXON
}

interface UpdateHHOptions {
    type: typeof AppActionTypes.UPDATE_HH_OPTIONS
    options: HHOptions
}

interface UpdateVHOptions {
    type: typeof AppActionTypes.UPDATE_VH_OPTIONS
    options: VHOptions
}

interface UpdatePublicationsOptions {
    type: typeof AppActionTypes.UPDATE_PUBLICATIONS_OPTIONS
    options: PublicationsOptions
}

interface UpdateMethodsOptions {
    type: typeof AppActionTypes.UPDATE_METHODS_OPTIONS
    options: MethodsOptions
}
