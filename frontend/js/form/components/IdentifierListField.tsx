import React from 'react'

import { Annotation } from 'form/types'
import { IdentifierList } from 'form/types'

import { AnnotationSearchField } from './AnnotationSearchField'

type Props = {
    list: IdentifierList
    update: (identifiers: string) => void
    select: (list: IdentifierList) => void
    remove: () => void
}

const annotationToIdentifierList = (key: number, annotation: Annotation): IdentifierList => {
    return {
        key: key,
        name: `${annotation.name} (${annotation.ref})`,
        identifiers: annotation.identifiers.join(', '),
    }
}

export const IdentifierListField: React.FC<Props> = ({ list, update, select, remove }) => {
    const onChange = e => update(e.target.value)

    const onClickRemove = e => remove()

    return (
        <div className="form-group">
            <label>{list.name}</label>
            <div className="row">
                <div className="col">
                    <AnnotationSearchField
                        select={(annotation: Annotation) => select(annotationToIdentifierList(list.key, annotation))}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="input-group">
                        <textarea className="form-control form-control-lg" value={list.identifiers} onChange={onChange} />
                        <div className="input-group-append">
                            <button type="button" className="btn btn-danger" onClick={onClickRemove}>
                                X
                            </button>
                        </div>
                    </div>
                    <small className="form-text text-muted">
                        Uniprot accession numbers or names spaced by commas or new lines.
                </small>
                </div>
            </div>
        </div>
    )
}
