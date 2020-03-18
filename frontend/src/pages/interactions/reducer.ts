import { combineReducers } from '@reduxjs/toolkit'
import { reducer as options } from 'features/options'
import { reducer as taxonomy } from 'features/taxonomy'
import { reducer as identifiers } from 'features/identifiers'

export const reducer = combineReducers({
    search: combineReducers({ identifiers, taxonomy, options })
})
