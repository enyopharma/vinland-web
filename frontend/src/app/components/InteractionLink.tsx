import React from 'react'
import { Link } from 'react-router-dom'

type InteractionLinkProps = {
    id: number
    target?: string
}

export const InteractionLink: React.FC<InteractionLinkProps> = ({ id, target = '', children }) => {
    const href = `/interactions/${id}`
    const style = { textDecoration: 'none' }

    return (
        <Link to={href} style={style} target={target}>
            {children}
        </Link>
    )
}
