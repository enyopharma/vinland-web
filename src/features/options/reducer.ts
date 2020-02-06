import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Options } from '.'

const initialState: Options = {
    hh: true,
    vh: true,
    neighbors: true,
    publications: 1,
    methods: 1,
}

const slice = createSlice({
    name: 'options',
    initialState: initialState,
    reducers: {
        setHH: {
            prepare: (hh: boolean) => ({ payload: { hh } }),
            reducer: (state, action: PayloadAction<{ hh: boolean }>) => {
                state.hh = action.payload.hh
            },
        },
        setVH: {
            prepare: (vh: boolean) => ({ payload: { vh } }),
            reducer: (state, action: PayloadAction<{ vh: boolean }>) => {
                state.vh = action.payload.vh
            },
        },
        setNeighbors: {
            prepare: (neighbors: boolean) => ({ payload: { neighbors } }),
            reducer: (state, action: PayloadAction<{ neighbors: boolean }>) => {
                state.neighbors = action.payload.neighbors
            },
        },
        setPublications: {
            prepare: (publications: number) => ({ payload: { publications } }),
            reducer: (state, action: PayloadAction<{ publications: number }>) => {
                state.publications = Math.max(1, action.payload.publications)
            },
        },
        setMethods: {
            prepare: (methods: number) => ({ payload: { methods } }),
            reducer: (state, action: PayloadAction<{ methods: number }>) => {
                state.methods = Math.max(1, action.payload.methods)
            },
        },
    }
})

export const { reducer, actions } = slice
