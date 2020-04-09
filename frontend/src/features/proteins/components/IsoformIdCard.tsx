import React from 'react'

import { Protein, Isoform } from 'features/proteins'

type Props = {
    protein: Protein
    isoform: Isoform
}

export const IsoformIdCard: React.FC<Props> = ({ protein, isoform }) => {
    return (
        <div className="card">
            <div className="card-header">
                {isoform.accession}
            </div>
            <div className="card-body">
                <div className="form-group">
                    <textarea
                        className="form-control"
                        value={isoform.sequence}
                        rows={6}
                        readOnly
                    />
                </div>
            </div>
        </div>
    )
}
