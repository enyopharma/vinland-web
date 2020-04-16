import React, { useState } from 'react'

import { Protein, Isoform } from 'features/proteins'
import { IsoformIdCardSuspense } from './IsoformIdCardSuspense'

type Props = {
    protein: Protein
}

const getCanonical = (protein: Protein) => {
    const sequences = protein.isoforms.filter(isoform => isoform.is_canonical)

    if (sequences.length === 1) {
        return sequences[0]
    }

    throw new Error('canonical isoform error')
}

const getIsoformLabel = (isoform: Isoform) => {
    const { accession, is_canonical, is_mature, start, stop } = isoform

    if (!is_canonical) {
        return accession
    }

    return !is_mature
        ? `${accession} (canonical)`
        : `Mature protein from ${accession} [${start}, ${stop}]`
}

export const ProteinIdCard: React.FC<Props> = ({ protein }) => {
    const canonical = getCanonical(protein)

    const [isoform_id, setIsoformId] = useState<number>(canonical.id)

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
                    onChange={e => setIsoformId(parseInt(e.target.value))}
                    disabled={protein.isoforms.length === 1}
                >
                    {protein.isoforms.map((isoform, i) => (
                        <option key={i} value={isoform.id}>
                            {getIsoformLabel(isoform)}
                        </option>
                    ))}
                </select>
            </div>
            <IsoformIdCardSuspense protein={protein} id={isoform_id} />
        </React.Fragment>
    )
}
