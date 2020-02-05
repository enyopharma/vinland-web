import { Reducer, Action, combineReducers } from 'redux'

/**
 * types.
 */
export type Taxonomy = {
    taxon: Taxon | null
    names: Name[]
}

export type Taxon = {
    readonly ncbi_taxon_id: number
    readonly name: string
    readonly nb_interactions: number
}

export type Name = string

/**
 * actions.
 */
export const SELECT = 'search/taxonomy/SELECT'
export const UNSELECT = 'search/taxonomy/UNSELECT'
export const UPDATE = 'search/taxonomy/UPDATE'

export type TaxonomyAction =
    | SelectAction
    | UnselectAction
    | UpdateAction

interface SelectAction extends Action<typeof SELECT> {
    taxon: Taxon
}

interface UnselectAction extends Action<typeof UNSELECT> {
    //
}

interface UpdateAction extends Action<typeof UPDATE> {
    names: Name[]
}

/**
 * creators.
 */
export const creators = {
    select: (taxon: Taxon): TaxonomyAction => ({ type: SELECT, taxon }),
    unselect: (): TaxonomyAction => ({ type: UNSELECT }),
    update: (names: Name[]): TaxonomyAction => ({ type: UPDATE, names })
}

/**
 * reducer.
 */
const taxon: Reducer<Taxon | null, TaxonomyAction> = (state = null, action) => {
    switch (action.type) {
        case SELECT:
            return action.taxon
        case UNSELECT:
            return null
        default:
            return state
    }
}

const names: Reducer<Name[], TaxonomyAction> = (state = [], action) => {
    switch (action.type) {
        case UNSELECT:
            return []
        case UPDATE:
            return action.names
        default:
            return state
    }
}

export const reducer = combineReducers({ taxon, names })
