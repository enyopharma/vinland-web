import { createContext, useReducer, useContext } from 'react'
import { config } from './config'

export type TypeTab = 'interactions' | 'proteins' | 'network'

export type ProteinTab = 'a' | 'h' | 'v'

type NavState = {
    tab: TypeTab
    interactions: { offset: number }
    proteins: { tab: 'a' | 'h' | 'v', offsets: { a: number, h: number, v: number } }
    network: { ratio: number, labels: boolean }
}

type NavAction =
    | { type: 'tab', payload: TypeTab }
    | { type: 'interactions.offset', payload: number }
    | { type: 'proteins.tab', payload: ProteinTab }
    | { type: 'proteins.offset', payload: { tab: ProteinTab, offset: number } }
    | { type: 'network.ratio', payload: number }
    | { type: 'network.labels', payload: boolean }
    | { type: 'reset' }

const initialState = {
    tab: 'interactions' as TypeTab,
    interactions: { offset: 0 },
    proteins: { tab: 'a' as ProteinTab, offsets: { a: 0, h: 0, v: 0 } },
    network: { ratio: config.ratio, labels: false },
}

const reducer = (state: NavState, action: NavAction) => {
    switch (action.type) {
        case 'tab':
            return { ...state, tab: action.payload }
        case 'interactions.offset':
            return { ...state, interactions: { offset: action.payload } }
        case 'proteins.tab':
            return { ...state, proteins: { ...state.proteins, tab: action.payload } }
        case 'proteins.offset':
            const offsets = { ...state.proteins.offsets, [action.payload.tab]: action.payload.offset }

            return { ...state, proteins: { ...state.proteins, offsets } }
        case 'network.ratio':
            return { ...state, network: { ...state.network, ratio: action.payload } }
        case 'network.labels':
            return { ...state, network: { ...state.network, labels: action.payload } }
        case 'reset':
            return {
                tab: state.tab,
                interactions: { offset: 0 },
                proteins: { tab: state.proteins.tab, offsets: { a: 0, h: 0, v: 0 } },
                network: { ratio: config.ratio, labels: state.network.labels },
            }
        default:
            throw new Error()
    }
}

export const NavContext = createContext<[NavState, (action: NavAction) => void]>([
    initialState, (action: NavAction) => { }
])

export const useNavState = () => useReducer(reducer, initialState)

export const useNavContext = () => useContext(NavContext)
