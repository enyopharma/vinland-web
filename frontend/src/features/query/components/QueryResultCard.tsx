import React from 'react'

import { QueryResultTab as Tab, ComputationCache } from 'features/query'
import { usePersistentState } from 'features/query'

import { QueryResultCardBodySuspense } from './QueryResultCardBodySuspense'

type Props = {
    result: ComputationCache
}

export const QueryResultCard: React.FC<Props> = ({ result }) => {
    const [tab, setTab] = usePersistentState<Tab>('tab', 'interactions')

    return (
        <div className="card">
            <div className="card-header pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <TabLink tab="interactions" current={tab} update={setTab}>
                            Interactions
                        </TabLink>
                    </li>
                    <li className="nav-item">
                        <TabLink tab="proteins" current={tab} update={setTab}>
                            Proteins
                        </TabLink>
                    </li>
                    <li className="nav-item">
                        <TabLink tab="network" current={tab} update={setTab}>
                            Network
                        </TabLink>
                    </li>
                </ul>
            </div>
            <QueryResultCardBodySuspense tab={tab} result={result} />
        </div>
    )
}

const TabLink: React.FC<{ tab: Tab, current: Tab, update: (tab: Tab) => void }> = (props) => {
    const { tab, current, update, children } = props

    const classes = current === tab ? 'nav-link active' : 'nav-link'

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault()
        update(tab)
    }

    return <a href="/" className={classes} onClick={onClick}>{children}</a>
}
