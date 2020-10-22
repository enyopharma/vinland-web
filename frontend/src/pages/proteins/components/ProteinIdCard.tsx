import React, { useEffect, useState } from 'react'

import { ProgressBar } from 'app/partials'

import { resources } from '../api'
import { Protein, Isoform } from '../types'

const InteractionTable = React.lazy(() => import('./InteractionTable').then(module => ({ default: module.InteractionTable })))

type Props = {
    protein: Protein
}

export const ProteinIdCard: React.FC<Props> = ({ protein }) => {
    const [isoform_id, setIsoformId] = useState<number>(canonicalId(protein))

    useEffect(() => setIsoformId(canonicalId(protein)), [protein])

    return (
        <React.Fragment>
            <h1>
                Protein ID Card - {protein.accession}/{protein.name}
            </h1>
            <p>
                {protein.taxon} - {protein.description}
            </p>
            <div className="form-group">
                <select
                    className="form-control"
                    value={isoform_id}
                    onChange={e => { setIsoformId(parseInt(e.target.value)); console.log(e) }}
                    disabled={protein.isoforms.length === 1}
                >
                    {protein.isoforms.map((isoform, i) => <IsoformOption key={i} isoform={isoform} />)}
                </select>
            </div>
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#vh">VH interactions</a></li>
                {protein.type === 'h' && <li><a href="#hh">HH interactions</a></li>}
            </ul>
            <hr />
            <React.Suspense fallback={<ProgressBar />}>
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="sequence">Sequence</h2>
                <div className="form-group">
                    <SequenceFetcher protein={protein} isoform_id={isoform_id} />
                </div>
                <div className="float-right">[<a href="#top">top</a>]</div>
                <h2 id="vh">VH interactions</h2>
                <InteractionFetcher type="vh" protein={protein} isoform_id={isoform_id} />
                {protein.type === 'h' && (
                    <React.Fragment>
                        <div className="float-right">[<a href="#top">top</a>]</div>
                        <h2 id="hh">HH interactions</h2>
                        <InteractionFetcher type="hh" protein={protein} isoform_id={isoform_id} />
                    </React.Fragment>
                )}
            </React.Suspense>
        </React.Fragment>
    )
}

type IsoformOptionProps = {
    isoform: Isoform
}

const IsoformOption: React.FC<IsoformOptionProps> = ({ isoform }) => {
    const { id, accession, is_canonical, is_mature, start, stop } = isoform

    const label = is_mature
        ? `Mature protein from ${accession} [${start}, ${stop}]`
        : is_canonical ? `${accession} (canonical)` : accession

    return <option value={id}>{label}</option>
}

type SequenceFetcherProps = {
    protein: Protein
    isoform_id: number
}

const SequenceFetcher: React.FC<SequenceFetcherProps> = ({ protein, isoform_id }) => {
    const isoform = resources.isoform(protein.id, isoform_id).read()

    return <textarea className="form-control" value={isoform.sequence} rows={6} readOnly={true} />
}

type InteractionFetcherProps = {
    type: 'hh' | 'vh'
    protein: Protein
    isoform_id: number
}

const InteractionFetcher: React.FC<InteractionFetcherProps> = ({ type, protein, isoform_id }) => {
    const isoform = resources.isoform(protein.id, isoform_id).read()
    const interactions = resources.interactions(type, protein.id, isoform_id).read()

    return (
        <InteractionTable
            type={protein.type}
            width={isoform.sequence.length}
            interactions={interactions}
        />
    )
}

const canonicalId = (protein: Protein) => {
    const isoforms = protein.isoforms.filter(isoform => isoform.is_canonical)

    if (isoforms.length === 1) {
        return isoforms[0].id
    }

    throw new Error('canonical isoform id error')
}
