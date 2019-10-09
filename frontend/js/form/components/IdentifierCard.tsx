import React from 'react'

import { IdentifiersMode } from 'form/types'
import { Annotation } from 'form/types'

import { IdentifierField } from './IdentifierField'
import { AnnotationSection } from './AnnotationSection'

type Props = {
    mode: IdentifiersMode
    update: (mode: IdentifiersMode) => void
    parsed: string[]
    manual: {
        identifiers: string[]
        update: (value: string) => void
    },
    annotations: {
        selected: Annotation[]
    }
}

export const IdentifierCard: React.FC<Props> = ({ mode, update, parsed, manual, annotations }) => {
    const isManual = mode == IdentifiersMode.manual
    const isAnnotations = mode == IdentifiersMode.annotations

    const getOnClick = (mode: IdentifiersMode) => {
        return e => { update(mode); e.preventDefault() }
    }

    return (
        <div className="card">
            <div className="card-header">
                <ul className="nav nav-pills card-header-pills">
                    <li className="nav-item">
                        <a
                            href="#"
                            className={'nav-link' + (isManual ? ' active' : '')}
                            onClick={getOnClick(IdentifiersMode.manual)}
                        >Manual</a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="#"
                            className={'nav-link' + (isAnnotations ? ' active' : '')}
                            onClick={getOnClick(IdentifiersMode.annotations)}
                        >Annotations</a>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                {
                    isManual ? (
                        <p>
                            <IdentifierField {...manual} />
                            <small className="form-text text-muted">
                                Uniprot accession numbers or names spaced by commas or new lines.
                        </small>
                        </p>
                    ) : null
                }
                {
                    isAnnotations ? (
                        <AnnotationSection {...annotations} />
                    ) : null
                }
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
