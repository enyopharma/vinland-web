import React from 'react'

type Props = {
    offset: number
    total: number
    limit: number
    update: (page: number) => void
}

export const PaginationRange: React.FC<Props> = ({ offset, total, limit, update }) => {
    const maxoffset = total > limit ? total - limit : 0

    const onChange = e => update(parseInt(e.target.value))

    return (
        <input
            type="range"
            min={0}
            max={maxoffset}
            value={offset}
            className="custom-range"
            onChange={onChange}
            disabled={maxoffset == 0}
        />
    )
}
