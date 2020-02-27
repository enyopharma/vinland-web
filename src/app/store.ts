import { configureStore } from '@reduxjs/toolkit'
import { reducer as search } from 'pages/search'

export const store = configureStore({
    reducer: { search }
})
