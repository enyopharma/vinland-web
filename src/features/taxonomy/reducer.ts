import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Taxonomy, Taxon, Name } from '.'

const initialState: Taxonomy = {
    taxon: null,
    names: [],
}

const slice = createSlice({
    name: 'taxonomy',
    initialState: initialState,
    reducers: {
        select: {
            prepare: (taxon: Taxon) => ({ payload: { taxon } }),
            reducer: (state, action: PayloadAction<{ taxon: Taxon }>) => {
                state.taxon = action.payload.taxon
            },
        },
        unselect: {
            prepare: () => ({ payload: {} }),
            reducer: (state, action: PayloadAction<{}>) => {
                state.taxon = null
            },
        },
        update: {
            prepare: (names: Name[]) => ({ payload: { names } }),
            reducer: (state, action: PayloadAction<{ names: Name[] }>) => {
                state.names = action.payload.names
            },
        },
    }
})

export const { reducer, actions } = slice
