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
