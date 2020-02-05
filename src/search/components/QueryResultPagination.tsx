import React from 'react'

type NavLink = {
    page: number
    active: boolean
}

type NavItem = NavLink | {}

type Props = {
    offset: number
    total: number
    limit: number
    update: (page: number) => void
}

type NavItemLiProps = {
    item: NavItem
    update: (i: number) => void
}

type NavLinkLiProps = {
    link: NavLink
    update: (i: number) => void
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
                {items(10, cur, max).map((item, i) => <ItemLi key={i} item={item} update={i => update(i * limit)} />)}
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

const ItemLi: React.FC<NavItemLiProps> = ({ item, update }) => {
    return isNavLink(item) ? <NavLinkLi link={item} update={update} /> : <PlaceholderLi />
}

const NavLinkLi: React.FC<NavLinkLiProps> = ({ link, update }) => (
    <li className={link.active ? 'page-item active' : 'page-item'}>
        <a href="/" className="page-link" onClick={e => { e.preventDefault(); update(link.page - 1) }}>
            {link.page}
        </a>
    </li>
)

const PlaceholderLi: React.FC = () => (
    <li className="page-item disabled">
        <a href="/" className="page-link" onClick={e => e.preventDefault()}>
            &hellip;
        </a>
    </li >
)

function isNavLink(item: NavItem): item is NavLink {
    return typeof (item as NavLink).page !== 'undefined'
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
