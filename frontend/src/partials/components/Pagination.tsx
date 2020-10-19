import React from 'react'

type Props = {
    offset: number
    total: number
    limit: number
    update: (offset: number) => void
}

export const Pagination: React.FC<Props> = ({ offset, total, limit, update }) => {
    const cur = Math.floor(offset / limit) + 1
    const max = Math.ceil(total / limit)

    const page = (page: number) => update((page - 1) * limit)

    return (
        <nav>
            <ul className="pagination justify-content-center">
                <Li state={cur === 1 ? 'disabled' : null} update={() => page(cur - 1)}>
                    &laquo;
                </Li>
                {items(10, cur, max).map((item, i) => item
                    ? <Li key={i} state={item.active ? 'active' : null} update={() => page(item.page)}>{item.page}</Li>
                    : <Li key={i} state={'disabled'} update={() => { }}>&hellip;</Li>
                )}
                <Li state={cur === max ? 'disabled' : null} update={() => page(cur + 1)}>
                    &raquo;
                </Li>
            </ul>
        </nav>
    )
}

type LiProps = {
    state: 'active' | 'disabled' | null
    update: () => void
}

const Li: React.FC<LiProps> = ({ state, update, children }) => (
    <li className={`page-item ${state === null ? '' : ' ' + state}`}>
        <A update={update}>{children}</A>
    </li>
)

type AProps = {
    update: () => void
}

const A: React.FC<AProps> = ({ update, children }) => {
    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update()
    }

    return (
        <a href="/" className="page-link" onClick={onClick}>
            {children}
        </a>
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
