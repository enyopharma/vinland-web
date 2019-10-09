import { IdentifierList } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'

export enum AppActionTypes {
    ADD_IDENTIFIER_LIST,
    SELECT_IDENTIFIER_LIST,
    UPDATE_IDENTIFIER_LIST,
    REMOVE_IDENTIFIER_LIST,
    SELECT_TAXON,
    UNSELECT_TAXON,
    UPDATE_HH_OPTIONS,
    UPDATE_VH_OPTIONS,
    UPDATE_PUBLICATIONS_OPTIONS,
    UPDATE_METHODS_OPTIONS,
}

export type AppAction =
    | AddIdentifierList
    | SelectIdentifierList
    | UpdateIdentifierList
    | RemoveIdentifierList
    | SelectTaxon
    | UnselectTaxon
    | UpdateHHOptions
    | UpdateVHOptions
    | UpdatePublicationsOptions
    | UpdateMethodsOptions

type AddIdentifierList = {
    type: typeof AppActionTypes.ADD_IDENTIFIER_LIST
}

type SelectIdentifierList = {
    type: typeof AppActionTypes.SELECT_IDENTIFIER_LIST
    i: number
    list: IdentifierList
}

type UpdateIdentifierList = {
    type: typeof AppActionTypes.UPDATE_IDENTIFIER_LIST
    i: number
    identifiers: string
}

type RemoveIdentifierList = {
    type: typeof AppActionTypes.REMOVE_IDENTIFIER_LIST
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
