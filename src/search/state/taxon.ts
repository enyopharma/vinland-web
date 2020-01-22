import { Reducer, Action } from 'redux'

/**
 * types.
 */
export type Taxon = {
    readonly ncbi_taxon_id: number
    readonly name: string
    readonly nb_interactions: number
}

/**
 * actions.
 */
export const SELECT = 'search/taxon/SELECT'
export const UNSELECT = 'search/taxon/UNSELECT'

export type TaxonAction =
    | SelectAction
    | UnselectAction

interface SelectAction extends Action<typeof SELECT> {
    readonly taxon: Taxon
}

interface UnselectAction extends Action<typeof UNSELECT> {
    //
}

/**
 * creators.
 */
export const creators = {
    select: (taxon: Taxon) => ({ type: SELECT, taxon }),
    unselect: () => ({ type: UNSELECT }),
}

/**
 * reducer.
 */
export const reducer: Reducer<Taxon | null, TaxonAction> = (state = null, action) => {
    switch (action.type) {
        case SELECT:
            return action.taxon
        case UNSELECT:
            return null
        default:
            return state
    }
}
