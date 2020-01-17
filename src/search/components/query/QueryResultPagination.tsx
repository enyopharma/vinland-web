import React from 'react'

type Props = {
    offset: number
    total: number
    limit: number
    update: (page: number) => void
}

type Placeholder = {}

type Link = {
    page: number
    active: boolean
}

type NavItem = Link | Placeholder

function isLink(item: NavItem): item is Link {
    return typeof (item as Link).page !== 'undefined'
}

const items = (nb: number, cur: number, max: number) => {
    if (max <= nb) return [
        ...[...Array(max)].map((_, i) => ({ page: i + 1, active: i + 1 === cur }))
    ]

    if (cur <= nb - 3) return [
        ...[...Array(nb - 2)].map((_, i) => ({ page: i + 1, active: cur === i + 1 })),
        {},
        { page: max - 1, active: false },
        { page: max, active: false },
    ]

    if (cur > max - nb + 3) return [
        { page: 1, active: false },
        { page: 2, active: false },
        {},
        ...[...Array(nb - 2)].map((_, i) => ({ page: max - nb + 3 + i, active: cur === max - nb + 3 + i })),
    ]

    return [
        { page: 1, active: false },
        { page: 2, active: false },
        {},
        { page: cur - 2, active: false },
        { page: cur - 1, active: false },
        { page: cur, active: true },
        { page: cur + 1, active: false },
        { page: cur + 2, active: false },
        {},
        { page: max - 1, active: cur === max - 1 },
        { page: max, active: cur === max },
    ]
}

const Link: React.FC<{ item: Link, update: (i: number) => void }> = ({ item, update }) => (
    <li className={item.active ? 'page-item active' : 'page-item'}>
        <a href="/" className="page-link" onClick={e => { e.preventDefault(); update(item.page - 1) }}>
            {item.page}
        </a>
    </li>
)

const Placeholder: React.FC = () => (
    <li className="page-item disabled">
        <a href="/" className="page-link" onClick={e => e.preventDefault()}>
            &hellip;
        </a>
    </li >
)

const NavItem: React.FC<{ item: NavItem, update: (i: number) => void }> = ({ item, update }) => {
    return isLink(item) ? <Link item={item} update={update} /> : <Placeholder />
}

export const QueryResultPagination: React.FC<Props> = ({ offset, total, limit, update }) => {
    const cur = Math.floor(offset / limit) + 1
    const max = Math.ceil(total / limit)

    return (
        <nav>
            <ul className="pagination justify-content-center">
                <li className={cur === 1 ? 'page-item disabled' : 'page-item'}>
                    <a
                        href="/"
                        className="page-link"
                        onClick={e => { e.preventDefault(); update(offset - limit) }}
                    >
                        &laquo;
                    </a>
                </li>
                {items(10, cur, max).map((item, i) => <NavItem key={i} item={item} update={i => update(i * limit)} />)}
                <li className={cur === max ? 'page-item disabled' : 'page-item'}>
                    <a
                        href="/"
                        className="page-link"
                        onClick={e => { e.preventDefault(); update(offset + limit) }}
                    >
                        &raquo;
                    </a>
                </li>
            </ul>
        </nav>
    )
}
