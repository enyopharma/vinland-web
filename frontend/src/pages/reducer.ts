import { combineReducers } from '@reduxjs/toolkit'
import { reducer as proteins } from './reducers/proteins'

export const reducer = combineReducers({ proteins })
