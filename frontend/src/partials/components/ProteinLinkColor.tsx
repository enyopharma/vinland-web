import React from 'react'

import { ProteinLink } from './ProteinLink'

type ProteinLinkColorProps = {
    id: number
    type: 'h' | 'v'
    target?: string
}

export const ProteinLinkColor: React.FC<ProteinLinkColorProps> = (props) => {
    const classes = props.type === 'h' ? 'text-info' : 'text-danger'

    return (
        <ProteinLink {...props}>
            <span className={classes}>{props.children}</span>
        </ProteinLink>
    )
}
