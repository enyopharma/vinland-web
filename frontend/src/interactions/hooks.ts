import { useCallback } from 'react'
import { TypedUseSelectorHook, useSelector as useSelectorRaw, useDispatch } from 'react-redux'
import { AnyAction, ActionCreator } from '@reduxjs/toolkit'
import { SearchState, SearchDispatch } from './types'

export const useSelector: TypedUseSelectorHook<SearchState> = useSelectorRaw

export const useActionCreator = <T extends ActionCreator<AnyAction>>(creator: T) => {
    const dispatch: SearchDispatch = useDispatch()

    return useCallback((...args: Parameters<T>) => {
        dispatch(creator(...args))
    }, [dispatch, creator])
}
