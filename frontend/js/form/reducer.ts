import { combineReducers } from 'redux'

import { AppState } from './types'
import { IdentifierList } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'

import { AppAction } from './actions'
import { AppActionTypes } from './actions'

let listkeycounter = 0

const init: AppState = {
    identifiers: [{
        key: listkeycounter,
        name: 'Manual selection',
        identifiers: '',
    }],
    taxon: {
        left: 0,
        right: 0,
    },
    names: [],
    hh: {
        show: true,
        network: false,
    },
    vh: {
        show: true,
    },
    publications: {
        threshold: 1,
    },
    methods: {
        threshold: 1,
    }
}

const identifiers = (state: IdentifierList[] = init.identifiers, action: AppAction): IdentifierList[] => {
    switch (action.type) {
        case AppActionTypes.ADD_IDENTIFIER_LIST:
            return [...state, {
                key: ++listkeycounter,
                name: 'Manual selection',
                identifiers: '',
            }]
        case AppActionTypes.UPDATE_IDENTIFIER_LIST:
            return [
                ...state.slice(0, action.i),
                Object.assign({}, state[action.i], {
                    name: init.identifiers[0].name,
                    identifiers: action.identifiers,
                }),
                ...state.slice(action.i + 1),
            ]
        case AppActionTypes.REMOVE_IDENTIFIER_LIST:
            return [
                ...state.slice(0, action.i),
                ...state.slice(action.i + 1),
            ]
        case AppActionTypes.SELECT_ANNOTATION:
            const list = {
                key: ++listkeycounter,
                name: `${action.annotation.ref} - ${action.annotation.name}`,
                identifiers: action.annotation.accessions.join(', '),
            }

            if (state.length > 0 && state[state.length - 1].identifiers.trim().length == 0) {
                return [...state.slice(0, state.length - 1), list]
            }

            return [...state, list]
        default:
            return state
    }
}

const taxon = (state: TaxonSelection = init.taxon, action: AppAction): TaxonSelection => {
    switch (action.type) {
        case AppActionTypes.SELECT_TAXON:
            return action.taxon
        case AppActionTypes.UNSELECT_TAXON:
            return init.taxon
        default:
            return state
    }
}

const names = (state: string[] = init.names, action: AppAction): string[] => {
    return state
}

const hh = (state: HHOptions = init.hh, action: AppAction): HHOptions => {
    switch (action.type) {
        case AppActionTypes.UPDATE_HH_OPTIONS:
            return {
                show: action.options.show,
                network: action.options.show && action.options.network,
            }
        default:
            return state
    }
}

const vh = (state: VHOptions = init.vh, action: AppAction): VHOptions => {
    switch (action.type) {
        case AppActionTypes.UPDATE_VH_OPTIONS:
            return action.options
        default:
            return state
    }
}

const publications = (state: PublicationsOptions = init.publications, action: AppAction): PublicationsOptions => {
    switch (action.type) {
        case AppActionTypes.UPDATE_PUBLICATIONS_OPTIONS:
            return action.options
        default:
            return state
    }
}

const methods = (state: MethodsOptions = init.methods, action: AppAction): MethodsOptions => {
    switch (action.type) {
        case AppActionTypes.UPDATE_METHODS_OPTIONS:
            return action.options
        default:
            return state
    }
}

export const reducer = combineReducers<AppState, AppAction>({
    identifiers,
    taxon,
    names,
    hh,
    vh,
    publications,
    methods,
})
