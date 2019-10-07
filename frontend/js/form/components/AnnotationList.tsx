import React from 'react'

import { Annotation } from 'form/types'

import { AnnotationSearchField } from './AnnotationSearchField'

type Props = {
    selected: Annotation[]
}

export const AnnotationList: React.FC<Props> = ({ selected }) => {
    return (
        <div className="annotations">
            {selected.map((annotation, i) => (
                <p key={i}>{annotation.name}</p>
            ))}
            <AnnotationSearchField />
        </div>
    )
}
