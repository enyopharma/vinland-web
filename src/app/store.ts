import { createStore } from 'redux'
import { reducer } from './state'

export const store = createStore(reducer)
