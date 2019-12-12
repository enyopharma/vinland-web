import React from 'react'

type Props = {
    offset: number
    total: number
    limit: number
    update: (page: number) => void
}

export const QueryResultRange: React.FC<Props> = ({ offset, total, limit, update }) => (
    <input
        type="range"
        min={0}
        max={total > limit ? total - limit : 0}
        value={offset}
        className="custom-range"
        onChange={e => update(parseInt(e.target.value))}
    />
)
