import { useState, useCallback, useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AnyAction, ActionCreator } from '@reduxjs/toolkit'
import { AppState, AppDispatch } from './types'

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useActionCreator = <T extends ActionCreator<AnyAction>>(creator: T) => {
    const dispatch: AppDispatch = useDispatch()

    return useCallback((...args: Parameters<T>) => {
        dispatch(creator(...args))
    }, [dispatch, creator])
}

export const useDebounce = <T = any>(value: T, ms: number = 100): T => {
    const [v, update] = useState<T>(value)

    useEffect(() => {
        const timeout = setTimeout(() => {
            update(value)
        }, ms)

        return () => clearTimeout(timeout)
    }, [value, ms])

    return v
}
