import React, { Suspense, useEffect } from 'react'
import { resources } from '../api'
import { Resource, Stats } from '../types'

export const HomePage: React.FC = () => {
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
            <div id="top" className="jumbotron">
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
                <p className="mb-0">
                    <a href="#stats">Stats</a>{' - '}
                    <a href="#network">Network visualization</a>{' - '}
                    <a href="#contact">Contact</a>
                </p>
            </div>
            <StatsCard />
            {/** <MatureCard /> */}
            <NetworkCard />
            <ContactCard />
        </div>
    )
}

const StatsCard: React.FC = () => {
    const resource = resources.stats()

    return (
        <div id="stats" className="card mb-4">
            <div className="card-header">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2>Stats</h2>
            </div>
            <Suspense fallback={<StatsCardTable />}>
                <StatsCardTable resource={resource} />
            </Suspense>
        </div>
    )
}

type StatsCardTableProps = {
    resource?: Resource<Stats>
}

const StatsCardTable: React.FC<StatsCardTableProps> = ({ resource = null }) => {
    const stats = resource ? resource.read() : null

    return (
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
    )
}

/**
const taxa = [
    { ncbi_taxon_id: 11320, name: 'Flua' },
    { ncbi_taxon_id: 11676, name: 'HIV1' },
    { ncbi_taxon_id: 64320, name: 'Zika' },
    { ncbi_taxon_id: 10407, name: 'HBV' },
    { ncbi_taxon_id: 11103, name: 'HCV' },
    { ncbi_taxon_id: 12637, name: 'Dengue' },
    { ncbi_taxon_id: 10359, name: 'HHV5' },
    { ncbi_taxon_id: 10376, name: 'EBV' },
    { ncbi_taxon_id: 694009, name: 'SARS' },
    { ncbi_taxon_id: 11234, name: 'Measles' },
]

const MatureCard: React.FC = () => {
    const [active, setActive] = useState<number>(taxa[0].ncbi_taxon_id)
    const [resource, setResource] = useState<Resource<Mature[]>>(resources.matures(taxa[0].ncbi_taxon_id))

    const handleChangeTab = (e: React.MouseEvent, ncbi_taxon_id: number) => {
        e.preventDefault()
        setActive(ncbi_taxon_id)
        setResource(resources.matures(ncbi_taxon_id))
    }

    return (
        <div id="annotation" className="card mb-4">
            <div className="card-header">
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2>Viral annotation examples</h2>
                <ul className="nav nav-tabs card-header-tabs">
                    {taxa.map((taxon, i) => (
                        <li key={i} className="nav-item">
                            <a
                                href="/"
                                className={`nav-link ${active === taxon.ncbi_taxon_id ? 'active' : ''}`}
                                onClick={e => handleChangeTab(e, taxon.ncbi_taxon_id)}
                            >
                                {taxon.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ height: "400px", overflowY: 'auto' }}>
                <Suspense fallback={<MatureCardTable />}>
                    <MatureCardTable resource={resource} />
                </Suspense>
            </div>
        </div>
    )
}

type MatureCardTableProps = {
    resource?: Resource<Mature[]>
}

const MatureCardTable: React.FC<MatureCardTableProps> = ({ resource = null }) => {
    const matures = resource ? resource.read() : null

    if (!matures) return null

    return (
        <div className="card-body">
            <ul className="mb-0">
                {matures.map((mature, i) => (
                    <li key={i}>
                        {mature.name} =&gt; {mature.proteins
                            .map<React.ReactNode>((protein, j) => <ProteinLink key={j} id={protein.id} target="_blank">{protein.accession}</ProteinLink>)
                            .reduce((prev, curr) => [prev, ', ', curr])}
                    </li>
                ))}
            </ul>
        </div>
    )
}
*/

const NetworkCard: React.FC = () => (
    <div id="network" className="card mb-4">
        <div className="card-header">
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2>Network visualization examples</h2>
        </div>
        <div className="card-body">
            <div className="row">
                <div className="col-md">
                    <figure className="figure mb-4 mb-md-0">
                        <img src="./examples/autophagy-cropped.png" className="figure-img img-fluid" alt="Autophagy - VH network" />
                        <figcaption className="figure-caption">Autophagy - VH network</figcaption>
                    </figure>
                </div>
                <div className="col-md">
                    <figure className="figure mb-0">
                        <img src="./examples/hepatitis-c-cropped.png" className="figure-img img-fluid" alt="Hepatitis C - VH network" />
                        <figcaption className="figure-caption">Hepatitis C - VH network</figcaption>
                    </figure>
                </div>
            </div>
        </div>
    </div>
)

const ContactCard: React.FC = () => (
    <div id="contact" className="card">
        <div className="card-header">
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2>Contact</h2>
        </div>
        <div className="card-body">
            Send us general questions and feedback at <a
                href="mailto:contact@vinland.network"
                target="_blank"
                rel="noreferrer"
            >contact@vinland.network</a>.
        </div>
    </div>
)
