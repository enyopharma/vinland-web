import { Reducer, Action } from 'redux'

/**
 * types.
 */
export type Annotation = {
    readonly source: string
    readonly ref: string
    readonly name: string
    readonly accessions: string[]
}

export type IdentifierList = {
    readonly i: number
    readonly name: string
    readonly identifiers: string
}

/**
 * actions.
 */
export const ADD = 'search/identifier/ADD'
export const UPDATE = 'search/identifier/UPDATE'
export const REMOVE = 'search/identifier/REMOVE'
export const SELECT = 'search/identifier/SELECT'

export type IdentifierAction =
    | AddAction
    | UpdateAction
    | RemoveAction
    | SelectAction

interface AddAction extends Action<typeof ADD> {
    //
}

interface UpdateAction extends Action<typeof UPDATE> {
    readonly i: number
    readonly identifiers: string
}

interface RemoveAction extends Action<typeof REMOVE> {
    readonly i: number
}

interface SelectAction extends Action<typeof SELECT> {
    readonly annotation: Annotation
}

/**
 * creators.
 */
export const creators = {
    add: () => ({ type: ADD }),
    update: (i: number, identifiers: string) => ({ type: UPDATE, i, identifiers }),
    remove: (i: number) => ({ type: REMOVE, i }),
    select: (annotation: Annotation) => ({ type: SELECT, annotation }),
}

/**
 * reducer.
 */
let listkeycounter = 0

const init = [{
    i: listkeycounter,
    name: 'manual selection',
    identifiers: '',
}]

export const reducer: Reducer<IdentifierList[], IdentifierAction> = (state = init, action) => {
    switch (action.type) {
        case ADD:
            return [...state, {
                i: ++listkeycounter,
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
                i: ++listkeycounter,
                name: `${action.annotation.source} - ${action.annotation.ref} (${action.annotation.name})`,
                identifiers: action.annotation.accessions.join(', '),
            }

            if (state.length === 1 && state[0].identifiers.trim().length === 0) {
                return [list, ...state.slice(1)]
            }

            return [list, ...state]
        default:
            return state
    }
}

/**
 * utils.
 */
export const parse = (lists: IdentifierList[]) => lists.reduce((merged: string[], list: IdentifierList) => {
    return list.identifiers.split(/(,|\s|\|)+/)
        .map(i => i.trim().toUpperCase())
        .filter(i => i.length >= 2 && i.length <= 12)
        .reduce((merged, identifier) => {
            return merged.includes(identifier) ? merged : [...merged, identifier]
        }, merged)
}, [])
