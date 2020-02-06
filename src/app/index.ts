import { useCallback } from 'react'
import { TypedUseSelectorHook } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { AnyAction, ActionCreator } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { reducer as search } from './search'

type AppState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export type AppSelector<T> = (state: AppState) => T

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useActionCreator = <T extends ActionCreator<AnyAction>>(creator: T) => {
    const dispatch: AppDispatch = useDispatch()

    return useCallback((...args: Parameters<T>) => {
        dispatch(creator(...args))
    }, [dispatch, creator])
}

export const store = configureStore({
    reducer: { search }
})
