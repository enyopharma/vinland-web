import { combineReducers } from '@reduxjs/toolkit'
import { reducer as taxonomy } from 'features/taxonomy'
import { reducer as options } from 'features/options'
import { reducer as identifiers } from 'features/identifiers'

export const reducer = combineReducers({ identifiers, taxonomy, options })
