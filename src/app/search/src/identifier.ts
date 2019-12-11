import { Reducer, Action } from 'redux'
import { Annotation } from './annotation'

/**
 * types.
 */
export type IdentifierList = {
    key: number
    name: string
    identifiers: string
}

/**
 * actions.
 */
const ADD = 'search/identifier/ADD'
const UPDATE = 'search/identifier/UPDATE'
const REMOVE = 'search/identifier/REMOVE'
const SELECT = 'search/identifier/SELECT'

interface AddAction extends Action<typeof ADD> {
    //
}

interface UpdateAction extends Action<typeof UPDATE> {
    i: number
    identifiers: string
}

interface RemoveAction extends Action<typeof REMOVE> {
    i: number
}

interface SelectAction extends Action<typeof SELECT> {
    annotation: Annotation
}

/**
 * creators and reducer.
 */
let listkeycounter = 0

const init = [{
    key: listkeycounter,
    name: 'manual selection',
    identifiers: '',
}]

type IdentifierAction =
    | AddAction
    | UpdateAction
    | RemoveAction
    | SelectAction

export const add = (): IdentifierAction => ({ type: ADD })
export const update = (i: number, identifiers: string): IdentifierAction => ({ type: UPDATE, i, identifiers })
export const remove = (i: number): IdentifierAction => ({ type: REMOVE, i })
export const select = (annotation: Annotation): IdentifierAction => ({ type: SELECT, annotation })

export const reducer: Reducer<IdentifierList[], IdentifierAction> = (state = init, action) => {
    switch (action.type) {
        case ADD:
            return [...state, {
                key: ++listkeycounter,
                name: 'Manual selection',
                identifiers: '',
            }]
        case UPDATE:
            return [
                ...state.slice(0, action.i),
                Object.assign({}, state[action.i], {
                    name: init[0].name,
                    identifiers: action.identifiers,
                }),
                ...state.slice(action.i + 1),
            ]
        case REMOVE:
            return [
                ...state.slice(0, action.i),
                ...state.slice(action.i + 1),
            ]
        case SELECT:
            const list = {
                key: ++listkeycounter,
                name: `${action.annotation.source} - ${action.annotation.ref} (${action.annotation.name})`,
                identifiers: action.annotation.accessions.join(', '),
            }

            if (state.length > 0 && state[0].identifiers.trim().length === 0) {
                return [list, ...state.slice(1)]
            }

            return [list, ...state]
        default:
            return state
    }
}

/**
 * misc.
 */
export const parse = (lists: IdentifierList[]) => lists.reduce((merged: string[], list: IdentifierList) => {
    return list.identifiers.split(/(,|\s|\|)+/)
        .map(i => i.trim().toUpperCase())
        .filter(i => i.length >= 2 && i.length <= 12)
        .reduce((merged, identifier) => {
            return merged.includes(identifier) ? merged : [...merged, identifier]
        }, merged)
}, [])
