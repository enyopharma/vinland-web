import React from 'react'

import { Annotation } from 'form/types'
import { IdentifierList } from 'form/types'

import { IdentifierListField } from './IdentifierListField'
import { AnnotationSearchField } from './AnnotationSearchField'

type Props = {
    lists: IdentifierList[]
    add: () => void
    update: (i: number, identifiers: string) => void
    remove: (i: number) => void
    select: (annotation: Annotation) => void
    parsed: string[]
}

export const IdentifierCard: React.FC<Props> = ({ lists, parsed, ...actions }) => {
    const onClick = () => actions.add()

    return (
        <div className="card">
            <div className="card-body">
                {
                    lists.map((list, i) => (
                        <IdentifierListField
                            key={list.key}
                            list={list}
                            update={(identifiers: string) => actions.update(i, identifiers)}
                            remove={() => actions.remove(i)}
                        />
                    ))
                }
                <div className="row">
                    <div className="col">
                        <AnnotationSearchField select={actions.select} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-primary btn-block"
                            onClick={onClick}
                        >
                            Add a new identifier list
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                {parsed.length == 0
                    ? 'No identifier parsed'
                    : parsed.length + ' identifiers parsed'
                }
            </div>
        </div>
    )
}
