import React from 'react'

import { ProteinLink } from './ProteinLink'

type ProteinLinkImgProps = {
    id: number
    type: 'h' | 'v'
    accession: string
    name: string
    target?: string
}

export const ProteinLinkImg: React.FC<ProteinLinkImgProps> = (props) => (
    <ProteinLink {...props}>
        <img
            src={`/img/${props.type}.png`}
            alt={`${props.accession} - ${props.name}`}
            style={{ maxWidth: '1em' }}
        />
    </ProteinLink>
)
