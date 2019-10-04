import React from 'react'

import { Interaction } from 'form/types'

import { InteractionTable } from './InteractionTable'

type Props = {
    interactions: Interaction[]
}

export const InteractionList: React.FC<Props> = ({ interactions }) => {
    return (
        <React.Fragment>
            <div className="alert alert-success">
                {interactions.length} interactions found.
            </div>
            {interactions.length > 0 ? (
                <InteractionTable interactions={interactions} />
            ) : null}
        </React.Fragment>
    )
}
