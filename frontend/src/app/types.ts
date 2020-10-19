import { store } from './store'

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type SearchResult<T> = {
    label: string
    value: T
}
