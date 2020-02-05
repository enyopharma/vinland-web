import { useCallback } from 'react'
import { Reducer, combineReducers } from 'redux'
import { useSelector as useAppSelector } from 'react-redux'
import { useDispatch as useAppDispatch } from 'react-redux'
import { AppState } from 'app/state'
import { Taxonomy, TaxonomyAction, reducer as taxonomy } from './features/taxonomy'
import { Options, OptionsAction, reducer as options } from './features/options'
import { IdentifierList, IdentifierAction, reducer as identifiers } from './features/identifiers'

export type SearchState = {
    readonly identifiers: IdentifierList[]
    readonly taxonomy: Taxonomy
    readonly options: Options
}

export type SearchAction =
    | IdentifierAction
    | TaxonomyAction
    | OptionsAction

type SearchSelector = (search: SearchState) => any

type SearchActionCreator = (...args: any) => SearchAction

export const reducer: Reducer<SearchState, SearchAction> = combineReducers({
    identifiers,
    taxonomy,
    options,
})

export const useSelector = <T extends SearchSelector>(selector: T): ReturnType<T> => {
    return useAppSelector(({ search }: AppState) => selector(search))
}

export const useActionCreator = <T extends SearchActionCreator>(creator: T) => {
    const dispatch = useAppDispatch()

    return useCallback((...args: Parameters<T>) => { dispatch(creator(...args)) }, [dispatch, creator])
}
