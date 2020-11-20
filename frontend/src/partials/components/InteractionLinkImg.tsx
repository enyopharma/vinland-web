import React from 'react'
import { InteractionLink } from './InteractionLink'

type InteractionLinkImgProps = {
    id: number
    type: 'hh' | 'vh'
    target?: string
}

export const InteractionLinkImg: React.FC<InteractionLinkImgProps> = (props) => (
    <InteractionLink {...props}>
        <img
            src={`/img/${props.type}.png`}
            alt={`${props.type.toUpperCase()} interaction`}
            style={{ maxWidth: '1em' }}
        />
    </InteractionLink>
)
