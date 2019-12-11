import qs from 'querystring'
import { Reducer, Action } from 'redux'
import { SearchResult } from './shared'

/**
 * types.
 */
export type Taxon = {
    left: number
    right: number
    name: string
}

export type TaxonSelection = { left: 0, right: 0 } | Taxon

export function isSelectedTaxon(selection: TaxonSelection): selection is Taxon {
    return selection.left > 0 && selection.right > 0
}

/**
 * actions.
 */
const SELECT = 'search/taxon/SELECT'
const UNSELECT = 'search/taxon/UNSELECT'

interface SelectAction extends Action<typeof SELECT> {
    taxon: Taxon
}

interface UnselectAction extends Action<typeof UNSELECT> {
    //
}

/**
 * creators and reducer.
 */
const init = { left: 0, right: 0, name: '' }

type TaxonAction =
    | SelectAction
    | UnselectAction

export const select = (taxon: Taxon): TaxonAction => ({ type: SELECT, taxon })
export const unselect = (): TaxonAction => ({ type: UNSELECT })

export const reducer: Reducer<TaxonSelection, TaxonAction> = (state = init, action) => {
    switch (action.type) {
        case SELECT:
            return action.taxon
        case UNSELECT:
            return init
        default:
            return state
    }
}

/**
 * api.
 */
export const read = (limit: number) => {
    const cache: Record<string, SearchResult<Taxon>[]> = {}

    return (query: string): SearchResult<Taxon>[] => {
        if (cache[query]) return cache[query]

        throw new Promise(resolve => {
            setTimeout(() => getTaxa(query, limit)
                .then(results => cache[query] = results)
                .then(resolve), 300)
        })
    }
}

const getTaxa = async (query: string, limit: number): Promise<SearchResult<Taxon>[]> => {
    const host = process.env.REACT_APP_API_HOST || 'http://localhost'
    const querystr = qs.encode({ query: query, limit: limit })
    const params = { headers: { 'accept': 'application/json' } }

    try {
        const response = await fetch(`${host}/taxa?${querystr}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data.map((taxon: Taxon) => ({
            label: taxon.name,
            value: taxon,
        }))
    }

    catch (error) {
        console.log(error)
    }

    return []
}
