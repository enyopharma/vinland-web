import React from 'react'

type Props = {
    hh: boolean
    vh: boolean
    network: boolean
    setShowHH: (show: boolean) => void
    setShowVH: (show: boolean) => void
    setNetwork: (network: boolean) => void
}

export const DisplayOptionsRow: React.FC<Props> = ({ hh, vh, network, setShowHH, setShowVH, setNetwork }) => (
    <div className="row">
        <div className="col">
            <div className="form-check form-check-inline">
                <input
                    id="hh"
                    type="checkbox"
                    className="form-check-input"
                    checked={hh}
                    onChange={e => setShowHH(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="hh">
                    Show HH ppi
                    </label>
            </div>
            <div className="form-check form-check-inline">
                <input
                    id="network"
                    type="checkbox"
                    className="form-check-input"
                    checked={network}
                    onChange={e => setNetwork(e.target.checked)}
                    disabled={!hh}
                />
                <label className="form-check-label" htmlFor="network">
                    Network only for HH
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
                    onChange={e => setShowVH(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="vh">
                    Show VH ppi
                    </label>
            </div>
        </div>
    </div>
)
