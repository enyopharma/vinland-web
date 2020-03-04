import React from 'react'

import { config } from 'features/query'

type Props = {
    offset: number
    total: number
    setOffset: (offset: number) => void
}

export const Pagination: React.FC<Props> = ({ offset, total, setOffset }) => {
    const cur = Math.floor(offset / config.limit) + 1
    const max = Math.ceil(total / config.limit)

    const update = (page: number) => setOffset((page - 1) * config.limit)

    return (
        <nav>
            <ul className="pagination justify-content-center">
                <ItemLi state={cur === 1 ? 'disabled' : null} update={() => update(cur - 1)}>
                    &laquo;
                </ItemLi>
                {items(10, cur, max).map((item, i) => item
                    ? <ItemLi key={i} state={item.active ? 'active' : null} update={() => update(item.page)}>{item.page}</ItemLi>
                    : <ItemLi key={i} state={'disabled'} update={() => { }}>&hellip;</ItemLi>
                )}
                <ItemLi state={cur === max ? 'disabled' : null} update={() => update(cur + 1)}>
                    &raquo;
                </ItemLi>
            </ul>
        </nav>
    )
}

const ItemLi: React.FC<{ state: 'active' | 'disabled' | null, update: () => void }> = (props) => {
    const { state, update, children } = props

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update()
    }

    return (
        <li className={`page-item ${state === null ? '' : ' ' + state}`}>
            <a href="/" className="page-link" onClick={onClick}>
                {children}
            </a>
        </li>
    )
}

const items = (nb: number, cur: number, max: number) => {
    if (max <= nb) return [
        ...[...Array(max)].map((_, i) => ({ page: i + 1, active: i + 1 === cur }))
    ]

    if (cur <= nb - 3) return [
        ...[...Array(nb - 2)].map((_, i) => ({ page: i + 1, active: cur === i + 1 })),
        null,
        { page: max - 1, active: false },
        { page: max, active: false },
    ]

    if (cur > max - nb + 3) return [
        { page: 1, active: false },
        { page: 2, active: false },
        null,
        ...[...Array(nb - 2)].map((_, i) => ({ page: max - nb + 3 + i, active: cur === max - nb + 3 + i })),
    ]

    return [
        { page: 1, active: false },
        { page: 2, active: false },
        null,
        { page: cur - 2, active: false },
        { page: cur - 1, active: false },
        { page: cur, active: true },
        { page: cur + 1, active: false },
        { page: cur + 2, active: false },
        null,
        { page: max - 1, active: cur === max - 1 },
        { page: max, active: cur === max },
    ]
}
