import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { reducer as form } from 'form/reducer'
import { reducer as pages } from 'pages/reducer'

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: combineReducers({ form, pages })
})
