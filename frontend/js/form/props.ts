import { Dispatch } from 'redux'

import { AppState } from './types'
import { IdentifierList } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'
import { Query } from './types'

import { AppAction } from './actions'
import { AppActionTypes } from './actions'

export type AppProps = ReturnType<typeof mergeProps>

const mapStateToQuery = (state: AppState): Query => {
    return {
        human: {
            accessions: state.identifiers.reduce((merged, list) => {
                return list.identifiers.split(/(,|\s|\|)+/)
                    .map(i => i.trim().toUpperCase())
                    .filter(i => i.length >= 2 && i.length <= 12)
                    .reduce((merged, identifier) => {
                        return merged.includes(identifier) ? merged : [...merged, identifier]
                    }, merged)
            }, [])
        },
        virus: {
            left: state.taxon.left,
            right: state.taxon.right,
            names: state.names,
        },
        hh: state.hh,
        vh: state.vh,
        publications: state.publications,
        methods: state.methods,
    }
}


export const mapStateToProps = (state: AppState) => {
    return Object.assign({}, state, {
        query: mapStateToQuery(state)
    })
}

export const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
    return {
        addIdentifierList: () => dispatch({
            type: AppActionTypes.ADD_IDENTIFIER_LIST,
        }),
        selectIdentifierList: (i: number, list: IdentifierList) => dispatch({
            type: AppActionTypes.SELECT_IDENTIFIER_LIST,
            i: i,
            list: list,
        }),
        updateIdentifierList: (i: number, identifiers: string) => dispatch({
            type: AppActionTypes.UPDATE_IDENTIFIER_LIST,
            i: i,
            identifiers: identifiers,
        }),
        removeIdentifierList: (i: number) => dispatch({
            type: AppActionTypes.REMOVE_IDENTIFIER_LIST,
            i: i,
        }),
        selectTaxon: (taxon: TaxonSelection) => dispatch({
            type: AppActionTypes.SELECT_TAXON,
            taxon: taxon,
        }),
        unselectTaxon: () => dispatch({
            type: AppActionTypes.UNSELECT_TAXON,
        }),
        updateHHOptions: (options: HHOptions) => dispatch({
            type: AppActionTypes.UPDATE_HH_OPTIONS,
            options: options,
        }),
        updateVHOptions: (options: VHOptions) => dispatch({
            type: AppActionTypes.UPDATE_VH_OPTIONS,
            options: options,
        }),
        updatePublicationsOptions: (options: PublicationsOptions) => dispatch({
            type: AppActionTypes.UPDATE_PUBLICATIONS_OPTIONS,
            options: options,
        }),
        updateMethodsOptions: (options: MethodsOptions) => dispatch({
            type: AppActionTypes.UPDATE_METHODS_OPTIONS,
            options: options,
        }),
    }
}

export const mergeProps = (props: ReturnType<typeof mapStateToProps>, actions: ReturnType<typeof mapDispatchToProps>) => {
    return {
        identifiers: {
            lists: props.identifiers,
            add: actions.addIdentifierList,
            select: actions.selectIdentifierList,
            update: actions.updateIdentifierList,
            remove: actions.removeIdentifierList,
            parsed: props.query.human.accessions,
        },
        taxon: {
            selection: props.taxon,
            select: actions.selectTaxon,
            unselect: actions.unselectTaxon,
        },
        names: {
            selected: props.names,
        },
        hh: {
            value: props.hh,
            update: actions.updateHHOptions,
        },
        vh: {
            value: props.vh,
            update: actions.updateVHOptions,
        },
        publications: {
            value: props.publications,
            update: actions.updatePublicationsOptions,
        },
        methods: {
            value: props.methods,
            update: actions.updateMethodsOptions,
        },
        interactions: {
            query: props.query,
        },
    }
}
