import { Dispatch } from 'redux'

import { Query } from './types'
import { AppState } from './types'
import { Annotation } from './types'
import { TaxonSelection } from './types'
import { HHOptions, VHOptions } from './types'
import { PublicationsOptions, MethodsOptions } from './types'

import { AppAction } from './actions'
import { AppActionTypes } from './actions'

export type AppProps = ReturnType<typeof mergeProps>

const mapStateToQuery = (state: AppState): Query => {
    return {
        human: {
            accessions: state.identifiers
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
        updateIdentifiers: (identifiers: string) => dispatch({
            type: AppActionTypes.UPDATE_ACCESSIONS,
            identifiers: identifiers,
        }),
        addAnnotation: (annotation: Annotation) => dispatch({
            type: AppActionTypes.ADD_ANNOTATION,
            annotation: annotation,
        }),
        updateAnnotation: (i: number, identifiers: string) => dispatch({
            type: AppActionTypes.UPDATE_ANNOTATION,
            i: i,
            identifiers: identifiers,
        }),
        removeAnnotation: (i: number) => dispatch({
            type: AppActionTypes.REMOVE_ANNOTATION,
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
        manual: {
            identifiers: props.identifiers,
            update: actions.updateIdentifiers,
        },
        annotations: {
            selected: props.annotations,
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
