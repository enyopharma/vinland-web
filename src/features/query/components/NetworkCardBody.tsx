import React, { useEffect } from 'react'

import { ComputationCache } from 'features/query'
import { useNavContext } from 'features/query'

import { NetworkStage } from './NetworkStage'
import { CardBodyFallback } from './CardBodyFallback'

type Props = {
    result: ComputationCache
}

export const NetworkCardBody: React.FC<Props> = (props) => (
    <React.Suspense fallback={<CardBodyFallback />}>
        <CardBody {...props} />
    </React.Suspense>
)

const CardBody: React.FC<Props> = ({ result }) => {
    const network = result.network()

    const [{ network: { ratio, labels } }, dispatch] = useNavContext()

    useEffect(() => {
        const timeout = setTimeout(() => network.setRatio(ratio), 100)

        return () => { clearTimeout(timeout) }
    }, [network, ratio])

    useEffect(() => {
        const timeout = setTimeout(() => network.setLabels(labels), 100)

        return () => { clearTimeout(timeout) }
    }, [network, labels])

    const setRatio = (payload: number) => dispatch({ type: 'network.ratio', payload })
    const setLabels = (payload: boolean) => dispatch({ type: 'network.labels', payload })

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
