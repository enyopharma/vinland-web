import React from 'react'

type Props = {
    hh: boolean
    vh: boolean
    neighbors: boolean
    setHH: (hh: boolean) => void
    setVH: (vh: boolean) => void
    setNeighbors: (neighbors: boolean) => void
}

export const DisplayOptionsRow: React.FC<Props> = ({ hh, vh, neighbors, setHH, setVH, setNeighbors }) => (
    <div className="row">
        <div className="col-6">
            <div className="form-check form-check-inline">
                <input
                    id="neighbors"
                    type="checkbox"
                    className="form-check-input"
                    checked={neighbors}
                    onChange={e => setNeighbors(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="neighbors">
                    Include neighbors
                </label>
            </div>
        </div>
        <div className="col">
            <div className="form-check form-check-inline">
                <input
                    id="hh"
                    type="checkbox"
                    className="form-check-input"
                    checked={hh}
                    onChange={e => setHH(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="hh">
                    Show HH ppi
                </label>
            </div>
        </div>
        <div className="col">
            <div className="form-check form-check-inline">
                <input
                    id="vh"
                    type="checkbox"
                    className="form-check-input"
                    checked={vh}
                    onChange={e => setVH(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="vh">
                    Show VH ppi
                </label>
            </div>
        </div>
    </div>
)
