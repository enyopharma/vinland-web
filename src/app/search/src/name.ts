import { Reducer, Action } from 'redux'

export type Name = string

/**
 * actions.
 */
const UPDATE = 'search/names/UPDATE'

type NamesAction =
    | UpdateNames

interface UpdateNames extends Action<typeof UPDATE> {
    names: Name[]
}

export const update = (names: Name[]) => ({ type: UPDATE, names })

export const reducer: Reducer<Name[], NamesAction> = (state = [], action) => {
    switch (action.type) {
        case UPDATE:
            return action.names
        default:
            return state
    }
}
