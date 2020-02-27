import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IdentifierList, Annotation } from './types'

let listkeycounter = 0

const defaultname = 'Manual selection'

const initialState: IdentifierList[] = [{
    i: listkeycounter,
    name: defaultname,
    identifiers: '',
}]

export const { reducer, actions } = createSlice({
    name: 'identifiers',
    initialState: initialState,
    reducers: {
        add: {
            prepare: () => ({ payload: {} }),
            reducer: (state, action: PayloadAction<{}>) => {
                state.push({ i: ++listkeycounter, name: defaultname, identifiers: '' })
            },
        },
        update: {
            prepare: (i: number, identifiers: string) => ({ payload: { i, identifiers } }),
            reducer: (state, action: PayloadAction<{ i: number, identifiers: string }>) => {
                state[action.payload.i].identifiers = action.payload.identifiers
            },
        },
        remove: {
            prepare: (i: number) => ({ payload: { i } }),
            reducer: (state, action: PayloadAction<{ i: number }>) => {
                state.splice(action.payload.i, 1)
            },
        },
        select: {
            prepare: (annotation: Annotation) => ({ payload: { annotation } }),
            reducer: (state, action: PayloadAction<{ annotation: Annotation }>) => {
                const list = {
                    i: ++listkeycounter,
                    name: `${action.payload.annotation.source} - ${action.payload.annotation.ref} (${action.payload.annotation.name})`,
                    identifiers: action.payload.annotation.accessions.join(', '),
                }

                return state.length === 1 && state[0].identifiers.trim().length === 0
                    ? [list, ...state.slice(1)]
                    : [list, ...state];
            },
        },
    }
})
