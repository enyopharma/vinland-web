import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Taxonomy, Taxon, Name } from '../types'

const initialState: Taxonomy = {
    taxon: null,
    names: [],
}

export const { reducer, actions } = createSlice({
    name: 'taxonomy',
    initialState: initialState,
    reducers: {
        select: {
            prepare: (taxon: Taxon) => ({ payload: { taxon } }),
            reducer: (state, action: PayloadAction<{ taxon: Taxon }>) => {
                state.taxon = action.payload.taxon
                state.names = []
            },
        },
        unselect: {
            prepare: () => ({ payload: {} }),
            reducer: (state) => {
                state.taxon = null
                state.names = []
            },
        },
        update: {
            prepare: (names: Name[]) => ({ payload: { names } }),
            reducer: (state, action: PayloadAction<{ names: Name[] }>) => {
                state.names = action.payload.names
            },
        },
    },
})
