import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Timeout, PleaseWait } from 'partials'

import { resources } from '../api'
import { Resource, Interaction, Description, Protein, Isoform } from '../types'

const IsoformSelectbox = React.lazy(() => import('./IsoformSelectbox').then(module => ({ default: module.IsoformSelectbox })))

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
            <React.Suspense fallback={<Timeout><PleaseWait /></Timeout>}>
                <InteractionSection key={id} resource={resource} />
            </React.Suspense>
        </div>
    )
}

type InteractionSectionProps = {
    resource: Resource<RemoteData>
}

const InteractionSection: React.FC<InteractionSectionProps> = ({ resource }) => {
    const data = resource.read()

    const [selected1, setSelected1] = useState<number>(0)
    const [selected2, setSelected2] = useState<number>(0)

    const { interaction, descriptions } = data
    const { protein1, isoforms1 } = data
    const { protein2, isoforms2 } = data

    return (
        <React.Fragment>
            <h1>
                {interaction.type.toUpperCase()} Interaction
            </h1>
            <div className="row">
                <div className="col offset-4">
                    <ProteinSection protein={protein1} isoforms={isoforms1} selected={selected1} update={setSelected1} />
                </div>
                <div className="col">
                    <ProteinSection protein={protein2} isoforms={isoforms2} selected={selected2} update={setSelected2} />
                </div>
            </div>
            <DescriptionTable descriptions={descriptions} />
        </React.Fragment>
    )
}

type ProteinSectionProps = {
    protein: Protein
    isoforms: Isoform[]
    selected: number
    update: (i: number) => void
}

const ProteinSection: React.FC<ProteinSectionProps> = ({ protein, isoforms, selected, update }) => (
    <React.Fragment>
        <h2>
            {protein.accession}/{protein.name}
        </h2>
        <div className="form-group">
            <IsoformSelectbox isoforms={isoforms} selected={selected} update={update} />
        </div>
    </React.Fragment>
)

type DescriptionTableProps = {
    descriptions: Description[]
}

const DescriptionTable: React.FC<DescriptionTableProps> = ({ descriptions }) => (
    <table className="table">
        <thead>
            <tr>
                <th className="col-2 text-center">pmid</th>
                <th className="col-2 text-center">psimi id</th>
                <th className="col-4 text-center">Mapping 1</th>
                <th className="col-4 text-center">Mapping 2</th>
            </tr>
        </thead>
        <tbody>
            {descriptions.map((description, i) => (
                <tr>
                    <td className="text-center">
                        <span title={`${description.publication.year} - ${description.publication.title}`}>
                            {description.publication.pmid}
                        </span>
                    </td>
                    <td className="text-center">
                        <span title={description.method.name}>
                            {description.method.psimi_id}
                        </span>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            ))}
        </tbody>
    </table>
)
