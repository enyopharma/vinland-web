import { IdentifiersMode } from './types'
import { Annotation } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'

export enum AppActionTypes {
    UPDATE_IDENTIFIERS_MODE,
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
    | UpdateIdentifiersMode
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

type UpdateIdentifiersMode = {
    type: typeof AppActionTypes.UPDATE_IDENTIFIERS_MODE
    mode: IdentifiersMode
}

type UpdateAccessions = {
    type: typeof AppActionTypes.UPDATE_ACCESSIONS
    identifiers: string
}

type AddAnnotation = {
    type: typeof AppActionTypes.ADD_ANNOTATION
    annotation: Annotation
}

type UpdateAnnotation = {
    type: typeof AppActionTypes.UPDATE_ANNOTATION
    i: number
    identifiers: string
}

type RemoveAnnotation = {
    type: typeof AppActionTypes.REMOVE_ANNOTATION
    i: number
}

type SelectTaxon = {
    type: typeof AppActionTypes.SELECT_TAXON
    taxon: TaxonSelection
}

type UnselectTaxon = {
    type: typeof AppActionTypes.UNSELECT_TAXON
}

type UpdateHHOptions = {
    type: typeof AppActionTypes.UPDATE_HH_OPTIONS
    options: HHOptions
}

type UpdateVHOptions = {
    type: typeof AppActionTypes.UPDATE_VH_OPTIONS
    options: VHOptions
}

type UpdatePublicationsOptions = {
    type: typeof AppActionTypes.UPDATE_PUBLICATIONS_OPTIONS
    options: PublicationsOptions
}

type UpdateMethodsOptions = {
    type: typeof AppActionTypes.UPDATE_METHODS_OPTIONS
    options: MethodsOptions
}
