import React from 'react'
import { Link } from 'react-router-dom'

type ProteinLinkProps = {
    id: number
    target?: string
}

export const ProteinLink: React.FC<ProteinLinkProps> = ({ id, target = '', children }) => {
    const href = `/proteins/${id}`
    const style = { textDecoration: 'none' }

    return (
        <Link to={href} style={style} target={target}>
            {children}
        </Link>
    )
}
