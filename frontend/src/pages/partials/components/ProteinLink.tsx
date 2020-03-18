import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
    id: number
    type: 'h' | 'v'
    target?: string
}

export const ProteinLink: React.FC<Props> = ({ id, type, target = '', children }) => {
    const href = `/proteins/${id}`
    const style = { textDecoration: 'none' }
    const classes = type === 'h' ? 'text-info' : 'text-danger'

    return (
        <Link to={href} className={classes} style={style} target={target}>
            {children}
        </Link>
    )
}
