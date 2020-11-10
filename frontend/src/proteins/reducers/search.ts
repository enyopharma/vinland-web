import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { SearchState } from '../types'

const initialState: SearchState = {
    type: '',
    query: '',
}

export const { reducer, actions } = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
        setType: {
            prepare: (type: '' | 'h' | 'v') => ({ payload: { type } }),
            reducer: (state, action: PayloadAction<{ type: '' | 'h' | 'v' }>) => {
                state.type = action.payload.type
            },
        },
        setQuery: {
            prepare: (query: string) => ({ payload: { query } }),
            reducer: (state, action: PayloadAction<{ query: string }>) => {
                state.query = action.payload.query
            },
        },
    }
})
