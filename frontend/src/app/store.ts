import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { reducer as proteins } from 'proteins/reducer'
import { reducer as interactions } from 'interactions/reducer'

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: combineReducers({ proteins, interactions })
})
