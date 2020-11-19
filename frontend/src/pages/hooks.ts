import { useCallback } from 'react'
import { useSelector as useSelectorRaw, useDispatch } from 'react-redux'
import { AnyAction, ActionCreator } from '@reduxjs/toolkit'
import { AppState, AppDispatch } from 'app/store'
import { PageState } from './types'

export const useSelector = <T>(f: (state: PageState) => T): T => {
    return useSelectorRaw<AppState, T>(state => f(state.pages))
}

export const useActionCreator = <T extends ActionCreator<AnyAction>>(creator: T) => {
    const dispatch: AppDispatch = useDispatch()

    return useCallback((...args: Parameters<T>) => {
        dispatch(creator(...args))
    }, [dispatch, creator])
}
