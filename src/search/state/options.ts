import { Reducer, Action, combineReducers } from 'redux'

/**
 * types.
 */
export type Options = {
    readonly hh: boolean
    readonly vh: boolean
    readonly neighbors: boolean
    readonly publications: number
    readonly methods: number
}

/**
 * actions.
 */
const HH = 'search/options/HH'
const VH = 'search/options/VH'
const NEIGHBORS = 'search/options/NEIGHBORS'
const PUBLICATIONS = 'search/options/PUBLICATIONS'
const METHODS = 'search/options/METHODS'

export type OptionsAction =
    | SetHH
    | SetVH
    | SetNeighbors
    | SetPublications
    | SetMethods

interface SetHH extends Action<typeof HH> {
    hh: boolean
}

interface SetVH extends Action<typeof VH> {
    vh: boolean
}

interface SetNeighbors extends Action<typeof NEIGHBORS> {
    neighbors: boolean
}

interface SetPublications extends Action<typeof PUBLICATIONS> {
    threshold: number
}

interface SetMethods extends Action<typeof METHODS> {
    threshold: number
}

/**
 * creators.
 */
export const creators = {
    setHH: (hh: boolean) => ({ type: HH, hh }),
    setVH: (vh: boolean) => ({ type: VH, vh }),
    setNeighbors: (neighbors: boolean) => ({ type: NEIGHBORS, neighbors }),
    setPublications: (threshold: number) => ({ type: PUBLICATIONS, threshold }),
    setMethods: (threshold: number) => ({ type: METHODS, threshold }),
}

/**
 * reducer.
 */
const hh: Reducer<boolean, OptionsAction> = (state = true, action) => {
    switch (action.type) {
        case HH:
            return action.hh
        default:
            return state
    }
}

const vh: Reducer<boolean, OptionsAction> = (state = true, action) => {
    switch (action.type) {
        case VH:
            return action.vh
        default:
            return state
    }
}

const neighbors: Reducer<boolean, OptionsAction> = (state = true, action) => {
    switch (action.type) {
        case NEIGHBORS:
            return action.neighbors
        default:
            return state
    }
}

const publications: Reducer<number, OptionsAction> = (state = 1, action) => {
    switch (action.type) {
        case PUBLICATIONS:
            return action.threshold
        default:
            return state
    }
}

const methods: Reducer<number, OptionsAction> = (state = 1, action) => {
    switch (action.type) {
        case METHODS:
            return action.threshold
        default:
            return state
    }
}

export const reducer: Reducer<Options, OptionsAction> = combineReducers({ hh, vh, neighbors, publications, methods })
