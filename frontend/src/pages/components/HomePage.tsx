import React, { Suspense, useEffect } from 'react'
import { resources } from '../api'
import { Resource, Stats } from '../types'

export const HomePage: React.FC = () => {
    const stats = resources.stats()

    useEffect(() => {
        const { hash } = window.location

        if (hash.trim().length === 0) return

        const id = hash.replace('#', '')
        const element = window.document.getElementById(id)

        if (element) element.scrollIntoView()
    }, [])

    return (
        <div className="container">
            <div className="row" style={{ margin: '4rem 0 2rem 0' }}>
                <img src="./vinland_logo.png" alt="logo" className="img-fluid logo" />
            </div>
            <div className="jumbotron">
                <h1>Welcome to Vinland!</h1>
                <p>
                    Vinland is a unique virus-host interaction resource dedicated to drug discovery that structures literature-curated virus-host protein interaction data and integrates this information into the human protein interaction network.
                </p>
                <p>
                    Vinland results from an extensive and systematic review of the scientific literature. Our experts manually curate all published descriptions of virus-human protein-protein interactions, since the first reported virus-human protein interaction in the 80’s.
                </p>
                <p>
                    Vinland provides original information on protein interaction sequences. The viral protein interfaces of 5 to 20 amino acids are peptides that can be used as new chemical entities to manipulate cellular functions.
                </p>
            </div>
            <Suspense fallback={<EmptyStatsTable />}>
                <FullStatsTable resource={stats} />
            </Suspense>
            <div id="contact" className="card">
                <div className="card-header">
                    <h2>Contact</h2>
                </div>
                <div className="card-body">
                    Send us general questions and feedback at <a
                        href="mailto:bioinformatics@enyopharma.com"
                        target="_blank"
                        rel="noreferrer"
                    >bioinformatics@enyopharma.com</a>.
                </div>
            </div>
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
    <div className="card mb-4">
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
