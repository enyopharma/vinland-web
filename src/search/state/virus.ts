import { Reducer, Action, combineReducers } from 'redux'

/**
 * types.
 */
export type Virus = {
    readonly taxon: TaxonSelection
    readonly names: Name[]
}

export type Taxon = {
    readonly left: number
    readonly right: number
    readonly name: string
    readonly names: Name[]
}

export type Name = string

export type TaxonSelection = { readonly left: 0, readonly right: 0 } | Taxon

export function isSelectedTaxon(selection: TaxonSelection): selection is Taxon {
    return selection.left > 0 && selection.right > 0
}

/**
 * actions.
 */
export const SELECT_TAXON = 'search/virus/SELECT_TAXON'
export const UNSELECT_TAXON = 'search/virus/UNSELECT_TAXON'
export const UPDATE_NAMES = 'search/virus/UPDATE_NAMES'

export type VirusAction =
    | SelectTaxonAction
    | UnselectTaxonAction
    | UpdateNamesAction

interface SelectTaxonAction extends Action<typeof SELECT_TAXON> {
    readonly taxon: Taxon
}

interface UnselectTaxonAction extends Action<typeof UNSELECT_TAXON> {
    //
}

interface UpdateNamesAction extends Action<typeof UPDATE_NAMES> {
    readonly names: Name[]
}

/**
 * creators.
 */
export const creators = {
    selectTaxon: (taxon: Taxon) => ({ type: SELECT_TAXON, taxon }),
    unselectTaxon: () => ({ type: UNSELECT_TAXON }),
    updateNames: (names: Name[]) => ({ type: UPDATE_NAMES, names }),
}

/**
 * reducer.
 */
const init = {
    taxon: { left: 0, right: 0, name: '', names: [] },
    names: [],
}

const taxon: Reducer<TaxonSelection, VirusAction> = (state = init.taxon, action) => {
    switch (action.type) {
        case SELECT_TAXON:
            return action.taxon
        case UNSELECT_TAXON:
            return init.taxon
        default:
            return state
    }
}

const names: Reducer<Name[], VirusAction> = (state = init.names, action) => {
    switch (action.type) {
        case SELECT_TAXON:
            return []
        case UPDATE_NAMES:
            return action.names
        default:
            return state
    }
}

export const reducer: Reducer<Virus, VirusAction> = combineReducers({ taxon, names })
