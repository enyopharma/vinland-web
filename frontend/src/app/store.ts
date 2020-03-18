import { configureStore } from '@reduxjs/toolkit'
import { reducer as interactions } from 'pages/interactions'

export const store = configureStore({
    reducer: { interactions }
})
