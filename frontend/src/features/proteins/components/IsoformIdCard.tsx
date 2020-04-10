import React from 'react'

import { Protein, Isoform } from 'features/proteins'
import { InteractionTable } from './InteractionTable'

type Props = {
    protein: Protein
    isoform: Isoform
}

export const IsoformIdCard: React.FC<Props> = ({ protein, isoform }) => {
    return (
        <React.Fragment>
            <div className="form-group">
                <textarea
                    className="form-control"
                    value={isoform.sequence}
                    rows={6}
                    readOnly
                />
            </div>
            <h2>VH interactions</h2>
            {isoform.interactions.vh.length === 0
                ? (
                    <p>No interaction found</p>
                )
                : (
                    <InteractionTable
                        type={protein.type}
                        width={isoform.sequence.length}
                        interactions={isoform.interactions.vh}
                    />
                )
            }
            {protein.type === 'h' && (
                <React.Fragment>
                    <h2>HH interactions</h2>
                    {isoform.interactions.hh.length === 0
                        ? (
                            <p>No interaction found</p>
                        )
                        : (
                            <InteractionTable
                                type={protein.type}
                                width={isoform.sequence.length}
                                interactions={isoform.interactions.hh}
                            />
                        )
                    }
                </React.Fragment>
            )}
        </React.Fragment>
    )
}
