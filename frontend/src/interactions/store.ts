import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { reducer as options } from './reducers/options'
import { reducer as taxonomy } from './reducers/taxonomy'
import { reducer as identifiers } from './reducers/identifiers'

export const store = configureStore({
    reducer: combineReducers({ identifiers, taxonomy, options })
})
