import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { ProteinLinkImg, Timeout, Dots } from 'partials'

import { resources } from '../api'
import { canonicalIndex } from '../utils'
import { Resource, Protein, Isoform, Feature, Interactor } from '../types'

const FeatureTable = React.lazy(() => import('./FeatureTable').then(module => ({ default: module.FeatureTable })))
const InteractorTable = React.lazy(() => import('./InteractorTable').then(module => ({ default: module.InteractorTable })))
const IsoformSelectbox = React.lazy(() => import('./IsoformSelectbox').then(module => ({ default: module.IsoformSelectbox })))

type RemoteData = {
    protein: Protein
    isoforms: Isoform[]
}

const getRemoteDataResource = (protein_id: number): Resource<RemoteData> => {
    const p = resources.protein(protein_id)
    const i = resources.isoforms(protein_id)

    return {
        read: () => ({
            protein: p.read(),
            isoforms: i.read(),
        })
    }
}

type RemoteDataH = {
    features: Feature[]
    hh: Interactor[]
    vh: Interactor[]
}

const getRemoteDataResourceH = (protein_id: number, isoform_id: number): Resource<RemoteDataH> => {
    const f = resources.features(protein_id, isoform_id);
    const hh = resources.interactors(protein_id, 'h');
    const vh = resources.interactors(protein_id, 'v');

    return {
        read: () => ({
            features: f.read(),
            hh: hh.read(),
            vh: vh.read(),
        })
    }
}

type RemoteDataV = {
    features: Feature[]
    vh: Interactor[]
}

const getRemoteDataResourceV = (protein_id: number, isoform_id: number): Resource<RemoteDataV> => {
    const f = resources.features(protein_id, isoform_id);
    const vh = resources.interactors(protein_id, 'h');

    return {
        read: () => ({
            features: f.read(),
            vh: vh.read(),
        })
    }
}

export const ProteinPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const resource = getRemoteDataResource(parseInt(id))

    return (
        <div className="container">
            <React.Suspense fallback={<Fallback />}>
                <ProteinSection key={id} resource={resource} />
            </React.Suspense>
        </div>
    )
}

const Fallback: React.FC = () => (
    <Timeout>
        <div className="text-center">
            Please wait <Dots />
        </div>
    </Timeout>
)

type ProteinSectionProps = {
    resource: Resource<RemoteData>
}

const ProteinSection: React.FC<ProteinSectionProps> = ({ resource }) => {
    const { protein, isoforms } = resource.read()

    const [selected, setSelected] = useState<number>(canonicalIndex(isoforms))

    switch (protein.type) {
        case 'h':
            const resourceh = getRemoteDataResourceH(protein.id, isoforms[selected].id)

            return (
                <ProteinHSection
                    protein={protein}
                    isoforms={isoforms}
                    resource={resourceh}
                    selected={selected}
                    update={setSelected}
                />
            )
        case 'v':
            const resourcev = getRemoteDataResourceV(protein.id, isoforms[selected].id)

            return (
                <ProteinVSection
                    protein={protein}
                    isoforms={isoforms}
                    resource={resourcev}
                    selected={selected}
                    update={setSelected}
                />
            )
    }
}

type ProteinHSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    resource: Resource<RemoteDataH>
    selected: number
    update: (index: number) => void
}

const ProteinHSection: React.FC<ProteinHSectionProps> = ({ protein, isoforms, resource, selected, update }) => {
    const isoform = isoforms[selected]
    const { features, hh, vh } = resource.read()

    return (
        <React.Fragment>
            <ProteinInfoSection protein={protein} isoforms={isoforms} selected={selected} update={update} />
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#features">Sequence features</a></li>
                <li><a href="#vh">VH interactions</a></li>
                <li><a href="#hh">HH interactions</a></li>
            </ul>
            <hr />
            <SequenceSection isoform={isoform} />
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="features">Sequence features</h2>
            {features.length === 0
                ? <EmptyTable type="f" />
                : <FeatureTable isoform={isoform} features={features} />
            }
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="vh">VH interactions</h2>
            {vh.length === 0
                ? <EmptyTable type="v" />
                : <InteractorTable type={protein.type} isoform={isoform} interactors={vh} />
            }
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="hh">HH interactions</h2>
            {hh.length === 0
                ? <EmptyTable type="h" />
                : <InteractorTable type={protein.type} isoform={isoform} interactors={hh} />
            }
        </React.Fragment>
    )
}

type ProteinVSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    resource: Resource<RemoteDataV>
    selected: number
    update: (index: number) => void
}

const ProteinVSection: React.FC<ProteinVSectionProps> = ({ protein, isoforms, resource, selected, update }) => {
    const isoform = isoforms[selected]
    const { features, vh } = resource.read()

    return (
        <React.Fragment>
            <ProteinInfoSection protein={protein} isoforms={isoforms} selected={selected} update={update} />
            <hr />
            <ul>
                <li><a href="#sequence">Sequence</a></li>
                <li><a href="#features">Sequence features</a></li>
                <li><a href="#vh">VH interactions</a></li>
            </ul>
            <hr />
            <SequenceSection isoform={isoforms[selected]} />
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="features">Sequence features</h2>
            {features.length === 0
                ? <EmptyTable type="f" />
                : <FeatureTable isoform={isoform} features={features} />
            }
            <div className="float-right">[<a href="#top">top</a>]</div>
            <h2 id="vh">VH interactions</h2>
            {vh.length === 0
                ? <EmptyTable type="h" />
                : <InteractorTable type={protein.type} isoform={isoform} interactors={vh} />
            }
        </React.Fragment>
    )
}

type ProteinInfoSection = {
    protein: Protein
    isoforms: Isoform[]
    selected: number
    update: (index: number) => void
}

const ProteinInfoSection: React.FC<ProteinInfoSection> = ({ protein, isoforms, selected, update }) => (
    <React.Fragment>
        <h1>
            <ProteinLinkImg {...protein} /> Protein ID Card - {protein.accession}/{protein.name}
        </h1>
        <p>
            {protein.taxon} - {protein.description}
        </p>
        <div className="form-group">
            <IsoformSelectbox isoforms={isoforms} selected={selected} update={update} />
        </div>
    </React.Fragment>
)

type SequenceSectionProps = {
    isoform: Isoform
}

const SequenceSection: React.FC<SequenceSectionProps> = ({ isoform }) => (
    <React.Fragment>
        <div className="float-right">[<a href="#top">top</a>]</div>
        <h2 id="sequence">{isoform.accession} [{isoform.start} - {isoform.stop}]</h2>
        <div className="form-group">
            <textarea className="form-control" value={isoform.sequence} rows={6} readOnly={true} />
        </div>
    </React.Fragment>
)

type EmptyTableProps = {
    type: 'f' | 'h' | 'v'
}

const EmptyTable: React.FC<EmptyTableProps> = ({ type }) => (
    <p className="text-center">
        {empty[type]}
    </p>
)

const empty = {
    'f': 'No sequence feature',
    'h': 'No human interactor',
    'v': 'No viral interactor',
}
