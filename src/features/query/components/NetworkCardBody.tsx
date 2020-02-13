import React from 'react'

import { Interaction } from 'features/query'

import { NetworkD3 } from 'features/network'

type Props = {
    interactions: Interaction[]
}

export const NetworkCardBody: React.FC<Props> = ({ interactions }) => {
    return (
        <div className="card-body">
            <NetworkD3 interactions={interactions} />
        </div>
    )
}
