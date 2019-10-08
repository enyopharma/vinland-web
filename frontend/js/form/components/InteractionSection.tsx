import React, { useState } from 'react'

import { Interaction } from 'form/types'

import { PaginationRange } from './PaginationRange'
import { InteractionTable } from './InteractionTable'

type Props = {
    interactions: Interaction[]
}

const limit = 20

export const InteractionSection: React.FC<Props> = ({ interactions }) => {
    const [offset, setOffset] = useState<number>(0)

    return (
        <div className="interactions">
            <p>
                <PaginationRange offset={offset} total={interactions.length} limit={limit} update={setOffset} />
            </p>
            <InteractionTable interactions={interactions.slice(offset, offset + limit)} />
            <p>
                <PaginationRange offset={offset} total={interactions.length} limit={limit} update={setOffset} />
            </p>
        </div>
    )
}
