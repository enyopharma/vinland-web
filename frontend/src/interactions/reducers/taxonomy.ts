import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { resources } from '../api'
import { Taxonomy, Taxon, Name } from '../types'

const initialState: Taxonomy = {
    current: null,
    names: [],
}

export const { reducer, actions } = createSlice({
    name: 'taxonomy',
    initialState: initialState,
    reducers: {
        select: {
            prepare: (taxon: Taxon) => ({ payload: { taxon } }),
            reducer: (state, action: PayloadAction<{ taxon: Taxon }>) => {
                state.current = {
                    taxon: action.payload.taxon,
                    resource: resources.taxon(action.payload.taxon.ncbi_taxon_id),
                }

                state.names = []
            },
        },
        unselect: {
            prepare: () => ({ payload: {} }),
            reducer: (state) => {
                state.current = null
                state.names = []
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
