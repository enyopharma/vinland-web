import React from 'react'

import { IdentifiersMode } from 'form/types'
import { Annotation } from 'form/types'

import { IdentifierField } from './IdentifierField'
import { AnnotationList } from './AnnotationList'

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

export const IdentifierSection: React.FC<Props> = ({ mode, update, parsed, manual, annotations }) => {
    const isManual = mode == IdentifiersMode.manual
    const isAnnotations = mode == IdentifiersMode.annotations

    const getOnClick = (mode: IdentifiersMode) => {
        return e => { update(mode); e.preventDefault() }
    }

    return (
        <div className="identifiers">
            <div className="row">
                <div className="col">
                    <ul className="nav nav-tabs nav-justified">
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
            </div>
            <div className="row">
                <div className="col">
                    <p>
                        > {parsed.length == 0
                            ? 'No identifier parsed'
                            : parsed.length + ' identifiers parsed'
                        }
                    </p>
                </div>
            </div>
            {isManual ? (
                <div className="row">
                    <div className="col">
                        <IdentifierField {...manual} />
                        <small className="form-text text-muted">
                            Uniprot accession numbers or names spaced by commas or new lines.
                        </small>
                    </div>
                </div>
            ) : null}
            {isAnnotations ? (
                <div className="row">
                    <div className="col">
                        <AnnotationList {...annotations} />
                    </div>
                </div>
            ) : null}
        </div>
    )
}
