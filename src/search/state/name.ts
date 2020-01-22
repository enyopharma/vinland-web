import { Reducer, Action } from 'redux'

import { TaxonAction, SELECT as SELECT_TAXON } from 'search/state/taxon'

/**
 * types.
 */

export type Name = string

/**
 * actions.
 */
export const UPDATE = 'search/name/UPDATE'

export type NameAction =
    | UpdateAction
    | TaxonAction

interface UpdateAction extends Action<typeof UPDATE> {
    names: Name[]
}

/**
 * creators.
 */
export const creators = {
    update: (names: Name[]) => ({ type: UPDATE, names })
}

/**
 * reducer.
 */
export const reducer: Reducer<Name[], NameAction> = (state = [], action) => {
    switch (action.type) {
        case UPDATE:
            return action.names
        case SELECT_TAXON:
            return []
        default:
            return state
    }
}
