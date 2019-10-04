import { combineReducers } from 'redux'

import { AppState } from './types'
import { Annotation } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'

import { AppAction } from './actions'
import { AppActionTypes } from './actions'

const init: AppState = {
    identifiers: [],
    annotations: [],
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

const strToUniqList = (str: string): string[] => {
    return str.split(/(,|\s|\|)+/)
        .map(a => a.trim().toUpperCase())
        .filter(a => a.length >= 2 && a.length <= 12)
        .reduce((u, a) => u.includes(a) ? u : [...u, a], [])
}

const identifiers = (state: string[] = init.identifiers, action: AppAction): string[] => {
    switch (action.type) {
        case AppActionTypes.UPDATE_ACCESSIONS:
            return strToUniqList(action.identifiers)
        default:
            return state
    }
}

const annotations = (state: Annotation[] = init.annotations, action: AppAction): Annotation[] => {
    switch (action.type) {
        case AppActionTypes.ADD_ANNOTATION:
            return [...state, action.annotation]
        case AppActionTypes.UPDATE_ANNOTATION:
            return [
                ...state.slice(0, action.i),
                Object.assign({}, state[action.i], {
                    annotations: strToUniqList(action.identifiers),
                }),
                ...state.slice(action.i + 1),
            ]
        case AppActionTypes.REMOVE_ANNOTATION:
            return [
                ...state.slice(0, action.i),
                ...state.slice(action.i + 1),
            ]
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
    annotations,
    taxon,
    names,
    hh,
    vh,
    publications,
    methods,
})
