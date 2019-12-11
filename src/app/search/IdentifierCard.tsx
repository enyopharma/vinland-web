import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { SearchState } from './src/search'
import { Annotation } from './src/annotation'
import { add, update, remove, select, parse } from './src/identifier'

import { IdentifierListInput } from './IdentifierListInput'
import { AnnotationInput } from './AnnotationInput'

const s2p = ({ search }: { search: SearchState }) => ({
    lists: search.identifiers,
    parsed: parse(search.identifiers).length,
})

const d2p = (dispatch: Dispatch) => ({
    add: () => dispatch(add()),
    update: (i: number) => (identifiers: string) => dispatch(update(i, identifiers)),
    remove: (i: number) => () => dispatch(remove(i)),
    select: (annotation: Annotation) => dispatch(select(annotation))
})

type Props = ReturnType<typeof s2p> & ReturnType<typeof d2p>

const Stateless: React.FC<Props> = ({ lists, parsed, add, update, remove, select }) => (
    <div className="card">
        <div className="card-body">
            <AnnotationInput select={select} />
            <hr />
            {lists.map((list, i) => (
                <IdentifierListInput {...list} update={update(i)} remove={remove(i)} />
            ))}
            <button type="button" className="btn btn-primary btn-block" onClick={() => add()}>
                Add a new identifier list
            </button>
        </div>
        <div className="card-footer">
            {parsed === 0 ? 'No identifier parsed' : parsed + ' identifiers parsed'}
        </div>
    </div>
)

export const IdentifierCard = connect(s2p, d2p)(Stateless)
