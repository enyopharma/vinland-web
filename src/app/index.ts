import { useCallback } from 'react'
import { AnyAction, ActionCreator } from 'redux'
import { TypedUseSelectorHook } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { reducer as search } from './search'

type AppState = ReturnType<typeof reducer>
type AppDispatch = typeof store.dispatch

const reducer = combineReducers({ search })

export type AppSelector<T> = (state: AppState) => T

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useActionCreator = <T extends ActionCreator<AnyAction>>(creator: T) => {
    const dispatch: AppDispatch = useDispatch()

    return useCallback((...args: Parameters<T>) => {
        dispatch(creator(...args))
    }, [dispatch, creator])
}

export const store = createStore(reducer)
