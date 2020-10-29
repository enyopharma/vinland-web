import { configureStore } from '@reduxjs/toolkit'
import { reducer as interactions } from 'interactions'

export const store = configureStore({
    reducer: { interactions }
})
