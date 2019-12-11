import { Reducer, Action, combineReducers } from 'redux'

/**
 * types.
 */
export type Options = {
    hh: { show: boolean, network: boolean },
    vh: { show: boolean },
    publications: number,
    methods: number,
}

/**
 * actions.
 */
const HH = 'search/options/HH'
const VH = 'search/options/VH'
const NETWORK = 'search/options/NETWORK'
const PUBLICATIONS = 'search/options/PUBLICATIONS'
const METHODS = 'search/options/METHODS'

interface SetShowHH extends Action<typeof HH> {
    show: boolean
}

interface SetShowVH extends Action<typeof VH> {
    show: boolean
}

interface SetNetwork extends Action<typeof NETWORK> {
    network: boolean
}

interface SetPublicationsThreshold extends Action<typeof PUBLICATIONS> {
    threshold: number
}

interface SetMethodsThreshold extends Action<typeof METHODS> {
    threshold: number
}

/**
 * creators and reducer.
 */
type OptionsAction =
    | SetShowHH
    | SetShowVH
    | SetNetwork
    | SetPublicationsThreshold
    | SetMethodsThreshold

export const setShowHH = (show: boolean): SetShowHH => ({ type: HH, show })
export const setShowVH = (show: boolean): SetShowVH => ({ type: VH, show })
export const setNetwork = (network: boolean): SetNetwork => ({ type: NETWORK, network })
export const setPublicationsThreshold = (threshold: number): SetPublicationsThreshold => ({ type: PUBLICATIONS, threshold })
export const setMethodsThreshold = (threshold: number): SetMethodsThreshold => ({ type: METHODS, threshold })

const hh: Reducer<{ show: boolean, network: boolean }, OptionsAction> = (state = { show: true, network: false }, action) => {
    switch (action.type) {
        case HH:
            return { show: action.show, network: action.show && state.network }
        case NETWORK:
            return { show: state.show, network: state.show && action.network }
        default:
            return state
    }
}

const vh: Reducer<{ show: boolean }, OptionsAction> = (state = { show: true }, action) => {
    switch (action.type) {
        case VH:
            return { show: action.show }
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

export const reducer: Reducer<Options, OptionsAction> = combineReducers({ hh, vh, publications, methods })
