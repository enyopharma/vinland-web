import React, { useEffect } from 'react'

import { Network } from '../types'

import { NetworkStage } from './NetworkStage'

type Props = {
    network: Network
    ratio: number
    labels: boolean
    setRatio: (ratio: number) => void
    setLabels: (labels: boolean) => void
}

export const NetworkCardBody: React.FC<Props> = ({ network, ratio, labels, setRatio, setLabels }) => {
    useEffect(() => {
        const timeout = setTimeout(() => network.setRatio(ratio), 100)

        return () => { clearTimeout(timeout) }
    }, [network, ratio])

    useEffect(() => {
        const timeout = setTimeout(() => network.setLabels(labels), 100)

        return () => { clearTimeout(timeout) }
    }, [network, labels])

    return (
        <React.Fragment>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <button type="button" className="btn btn-block btn-primary" onClick={() => network.save()}>
                            Save image
                        </button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-primary" onClick={() => network.selectNeighbors()}>
                            Select neighbors
                        </button>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-block btn-primary" onClick={() => setLabels(!labels)}>
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
                        <button type="button" className="btn btn-block btn-primary" onClick={() => network.stop()}>
                            Stop layout
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <NetworkStage network={network} />
            </div>
        </React.Fragment>
    )
}
