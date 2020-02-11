import React, { Suspense, useState } from 'react'

import { Interaction } from 'features/query'

const ListCardBody = React.lazy(() => import('./ListCardBody').then(module => ({ default: module.ListCardBody })))
const NetworkCardBody = React.lazy(() => import('./NetworkCardBody').then(module => ({ default: module.NetworkCardBody })))

type Tab = 'list' | 'network'

type Props = {
    interactions: Interaction[]
}

type CardBodyProps = {
    tab: Tab
    interactions: Interaction[]
}

export const InteractionsCard: React.FC<Props> = ({ interactions }) => {
    const [tab, setTab] = useState<Tab>('list')

    const getHandleClick = (tab: Tab) => (e: any) => {
        e.preventDefault()
        setTab(tab)
    }

    return (
        <div className="card">
            <div className="card-header pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'list' ? 'nav-link active' : 'nav-link'}
                            onClick={getHandleClick('list')}
                        >
                            List view
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="/"
                            className={tab === 'network' ? 'nav-link active' : 'nav-link'}
                            onClick={getHandleClick('network')}
                        >
                            Network view
                        </a>
                    </li>
                </ul>
            </div>
            <Suspense fallback={<ProgressBarCardBody />}>
                <CardBody tab={tab} interactions={interactions} />
            </Suspense>
        </div>
    )
}

const ProgressBarCardBody = () => (
    <div className="card-body">
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: '100%' }}
            ></div>
        </div>
    </div>
)

const CardBody: React.FC<CardBodyProps> = ({ tab, interactions }) => {
    switch (tab) {
        case 'list':
            return <ListCardBody interactions={interactions} />
        case 'network':
            return <NetworkCardBody interactions={interactions}>network</NetworkCardBody>
        default:
            throw new Error()
    }
}
