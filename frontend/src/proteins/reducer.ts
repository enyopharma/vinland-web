import { combineReducers } from '@reduxjs/toolkit'
import { reducer as search } from './reducers/search'

export const reducer = combineReducers({ search })
