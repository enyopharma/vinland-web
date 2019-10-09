import React from 'react'

import { Annotation } from 'form/types'
import { IdentifierList } from 'form/types'

import { AnnotationSearchField } from './AnnotationSearchField'

type Props = {
    list: IdentifierList
    update: (identifiers: string) => void
    remove: () => void
}

export const IdentifierListField: React.FC<Props> = ({ list, update, remove }) => {
    const onChange = e => update(e.target.value)

    const onClick = e => remove()

    return (
        <div className="form-group">
            <label>{list.name}</label>
            <div className="row">
                <div className="col">
                    <div className="input-group">
                        <textarea
                            placeholder="Uniprot accession numbers or names spaced by commas or new lines."
                            className="form-control form-control-lg"
                            value={list.identifiers}
                            onChange={onChange}
                        />
                        <div className="input-group-append">
                            <button type="button" className="btn btn-danger" onClick={onClick}>
                                X
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
