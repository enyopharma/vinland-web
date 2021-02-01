import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { config } from '../config'
import { ResultNav, ResultTab, ProteinTab } from '../types'

const initialState: ResultNav = {
    tab: 'interactions',
    interactions: {
        offset: 0,
    },
    proteins: {
        tab: 'a',
        current: 0,
        offsets: { a: 0, h: 0, v: 0 },
    },
    network: {
        warning: true,
        ratio: config.ratio,
        labels: false,
    }
}

export const { reducer, actions } = createSlice({
    name: 'nav',
    initialState: initialState,
    reducers: {
        setResultTab: {
            prepare: (tab: ResultTab) => ({ payload: { tab } }),
            reducer: (state, action: PayloadAction<{ tab: ResultTab }>) => {
                state.tab = action.payload.tab
            },
        },
        setInteractionsOffset: {
            prepare: (offset: number) => ({ payload: { offset } }),
            reducer: (state, action: PayloadAction<{ offset: number }>) => {
                state.interactions.offset = action.payload.offset
            },
        },
        setProteinsTab: {
            prepare: (tab: ProteinTab) => ({ payload: { tab } }),
            reducer: (state, action: PayloadAction<{ tab: ProteinTab }>) => {
                state.proteins.tab = action.payload.tab
                state.proteins.current = state.proteins.offsets[action.payload.tab]
            },
        },
        setProteinsOffset: {
            prepare: (offset: number) => ({ payload: { offset } }),
            reducer: (state, action: PayloadAction<{ offset: number }>) => {
                state.proteins.current = action.payload.offset
                state.proteins.offsets[state.proteins.tab] = action.payload.offset
            },
        },
        bypassWarning: state => {
            state.network.warning = false
        },
        setNetworkRatio: {
            prepare: (ratio: number) => ({ payload: { ratio } }),
            reducer: (state, action: PayloadAction<{ ratio: number }>) => {
                state.network.ratio = action.payload.ratio
            },
        },
        setNetworkLabels: {
            prepare: (labels: boolean) => ({ payload: { labels } }),
            reducer: (state, action: PayloadAction<{ labels: boolean }>) => {
                state.network.labels = action.payload.labels
            },
        },
    },
})
