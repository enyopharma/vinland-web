import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { InteractionLinkImg, ProteinLinkImg, Timeout, Dots } from 'partials'

import { resources } from '../api'
import { canonicalIndex } from '../utils'
import { Resource, Interaction, Description, Protein, Isoform } from '../types'

const IsoformSelectbox = React.lazy(() => import('./IsoformSelectbox').then(module => ({ default: module.IsoformSelectbox })))
const DescriptionTable = React.lazy(() => import('./DescriptionTable').then(module => ({ default: module.DescriptionTable })))

type RemoteData = {
    interaction: Interaction
    protein1: Protein
    isoforms1: Isoform[]
    protein2: Protein
    isoforms2: Isoform[]
    descriptions: Description[]
}

const getRemoteDataResource = (id: number): Resource<RemoteData> => {
    const resource = resources.interaction(id)

    return {
        read: () => {
            const interaction = resource.read()

            const protein1 = resources.protein(interaction.protein1_id)
            const isoforms1 = resources.isoforms(interaction.protein1_id)
            const protein2 = resources.protein(interaction.protein2_id)
            const isoforms2 = resources.isoforms(interaction.protein2_id)
            const descriptions = resources.descriptions(interaction.id)

            return {
                interaction,
                protein1: protein1.read(),
                isoforms1: isoforms1.read(),
                protein2: protein2.read(),
                isoforms2: isoforms2.read(),
                descriptions: descriptions.read(),
            }
        }
    }
}

export const InteractionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const resource = getRemoteDataResource(parseInt(id))

    return (
        <div className="container">
            <React.Suspense fallback={<Fallback />}>
                <InteractionSection key={id} resource={resource} />
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

type InteractionSectionProps = {
    resource: Resource<RemoteData>
}

const InteractionSection: React.FC<InteractionSectionProps> = ({ resource }) => {
    const data = resource.read()

    const { interaction, descriptions } = data
    const { protein1, isoforms1 } = data
    const { protein2, isoforms2 } = data

    const [selected1, setSelected1] = useState<number>(canonicalIndex(isoforms1))
    const [selected2, setSelected2] = useState<number>(canonicalIndex(isoforms2))

    const isoform1 = isoforms1[selected1]
    const isoform2 = isoforms2[selected2]

    return (
        <React.Fragment>
            <h1 className="mb-4">
                <InteractionLinkImg {...interaction} /> {interaction.type.toUpperCase()} Interaction ID card
            </h1>
            <div className="row">
                <div className="col">
                    <h2>
                        <ProteinLinkImg {...protein1} /> {protein1.accession}/{protein1.name}
                    </h2>
                </div>
                <div className="col">
                    <h2>
                        <ProteinLinkImg {...protein2} /> {protein2.accession}/{protein2.name}
                    </h2>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p>
                        {protein1.taxon} - {protein1.description}
                    </p>
                </div>
                <div className="col">
                    <p>
                        {protein2.taxon} - {protein2.description}
                    </p>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <IsoformSelectbox isoforms={isoforms1} selected={selected1} update={setSelected1} />
                </div>
                <div className="col">
                    <IsoformSelectbox isoforms={isoforms2} selected={selected2} update={setSelected2} />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <h3>{isoform1.accession} [{isoform1.start} - {isoform1.stop}]</h3>
                    <div className="form-group">
                        <textarea className="form-control" value={isoform1.sequence} rows={3} readOnly={true} />
                    </div>
                </div>
                <div className="col">
                    <h3>{isoform2.accession} [{isoform2.start} - {isoform2.stop}]</h3>
                    <div className="form-group">
                        <textarea className="form-control" value={isoform2.sequence} rows={3} readOnly={true} />
                    </div>
                </div>
            </div>
            <DescriptionTable
                type1={protein1.type}
                type2={protein2.type}
                isoform1={isoform1}
                isoform2={isoform2}
                descriptions={descriptions}
            />
        </React.Fragment>
    )
}
