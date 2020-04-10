import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
    id: number
    target?: string
}

export const ProteinLink: React.FC<Props> = ({ id, target = '', children }) => {
    const href = `/proteins/${id}`
    const style = { textDecoration: 'none' }

    return (
        <Link to={href} style={style} target={target}>
            {children}
        </Link>
    )
}
