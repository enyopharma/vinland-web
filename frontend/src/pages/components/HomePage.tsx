import React, { Suspense } from 'react'
import { resources } from '../api'
import { Resource, Stats } from '../types'

export const HomePage: React.FC = () => {
    const stats = resources.stats()

    return (
        <div className="container">
            <div className="jumbotron">
                <h1>Welcome to Vinland!</h1>
                <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus porta eros est, ac varius nulla rutrum ac. Sed lectus ipsum, pharetra vel sodales sit amet, iaculis eu diam.
                </p>
            </div>
            <Suspense fallback={<EmptyStatsTable />}>
                <FullStatsTable resource={stats} />
            </Suspense>
        </div>
    )
}

const EmptyStatsTable: React.FC = () => <StatsTable />

type FullStatsTableProps = {
    resource: Resource<Stats>
}

const FullStatsTable: React.FC<FullStatsTableProps> = ({ resource }) => {
    const stats = resource.read()

    return <StatsTable stats={stats} />
}

type StatsTableProps = {
    stats?: Stats
}

const StatsTable: React.FC<StatsTableProps> = ({ stats = null }) => (
    <div className="card">
        <div className="card-header">
            <h2>Stats</h2>
        </div>
        <table className="table card-table">
            <thead>
                <tr>
                    <th className="text-center" style={{ width: '10%' }}>
                        Type
                    </th>
                    <th className="text-center" style={{ width: '30%' }}>
                        Descriptions
                    </th>
                    <th className="text-center" style={{ width: '30%' }}>
                        Interactions
                    </th>
                    <th className="text-center" style={{ width: '30%' }}>
                        Publications
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="text-center">
                        <strong><span className="text-danger">VH</span></strong>
                    </td>
                    <td className="text-center">
                        {stats ? stats.vh.descriptions : '-'}
                    </td>
                    <td className="text-center">
                        {stats ? stats.vh.interactions : '-'}
                    </td>
                    <td className="text-center">
                        {stats ? stats.vh.publications : '-'}
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <strong><span className="text-info">HH</span></strong>
                    </td>
                    <td className="text-center">
                        {stats ? stats.hh.descriptions : '-'}
                    </td>
                    <td className="text-center">
                        {stats ? stats.hh.interactions : '-'}
                    </td>
                    <td className="text-center">
                        {stats ? stats.hh.publications : '-'}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
)
