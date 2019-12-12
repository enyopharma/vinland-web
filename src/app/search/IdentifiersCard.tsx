import React from 'react'

import { Annotation } from './src/annotation'
import { IdentifierList } from './src/identifier'

import { IdentifierListInput } from './IdentifierListInput'
import { AnnotationInput } from './AnnotationInput'

type Props = {
    lists: IdentifierList[]
    parsed: number
    add: () => void
    update: (i: number) => (identifiers: string) => void
    remove: (i: number) => () => void
    select: (annotation: Annotation) => void
}

export const IdentifiersCard: React.FC<Props> = ({ lists, parsed, add, update, remove, select }) => (
    <div className="card">
        <div className="card-body">
            <AnnotationInput select={select} />
            <hr />
            {lists.map((list, i) => (
                <IdentifierListInput key={list.i} {...list} update={update(i)} remove={remove(i)} />
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
