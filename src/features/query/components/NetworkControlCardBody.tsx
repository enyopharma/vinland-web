import React, { useEffect } from 'react'

import { useDebounce } from 'app'

import { Network } from 'features/query'

type Props = {
    ratio: number
    labels: boolean
    network: Network
    setRatio: (ratio: number) => void
    setLabels: (labels: boolean) => void
}

export const NetworkControlCardBody: React.FC<Props> = ({ ratio, labels, network, setRatio, setLabels }) => {
    const debouncedRatio = useDebounce(ratio, 100)

    useEffect(() => { network.setRatio(debouncedRatio) }, [network, debouncedRatio])
    useEffect(() => { network.setLabels(labels) }, [network, labels])

    return (
        <div className="card-body">
            <div className="row">
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-block btn-primary"
                        onClick={() => network.save()}
                    >
                        Save image
                    </button>
                </div>
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-block btn-primary"
                        onClick={() => network.selectNeighbors()}
                    >
                        Select neighbors
                    </button>
                </div>
                <div className="col-2">
                    <button
                        type="button"
                        className="btn btn-block btn-primary"
                        onClick={() => setLabels(!labels)}
                    >
                        {labels ? 'Hide labels' : 'Show labels'}
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        value={ratio}
                        className="custom-range"
                        onChange={e => setRatio(parseInt(e.target.value))}
                    />
                </div>
                <div className="col-2">
                    <button
                        type="button"
                        className="btn btn-block btn-primary"
                        onClick={() => network.stop()}
                    >
                        Stop layout
                    </button>
                </div>
            </div>
        </div>
    )
}
