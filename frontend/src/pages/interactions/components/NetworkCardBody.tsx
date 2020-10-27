import React, { useRef, useEffect } from 'react'

import { Network } from '../types'

type Props = {
    network: Network
    ratio: number
    labels: boolean
    setRatio: (ratio: number) => void
    setLabels: (labels: boolean) => void
}

export const NetworkCardBody: React.FC<Props> = ({ network, ratio, labels, setRatio, setLabels }) => (
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
                    <LabelsButton network={network} labels={labels} update={setLabels}>
                        {labels ? 'Hide labels' : 'Show labels'}
                    </LabelsButton>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <RatioRange network={network} ratio={ratio} update={setRatio} />
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-block btn-primary" onClick={() => network.stop()}>
                        Stop layout
                        </button>
                </div>
            </div>
        </div>
        <div className="card-body">
            <NetworkContainer network={network} />
        </div>
    </React.Fragment>
)

type LabelsButtonProps = {
    network: Network
    labels: boolean
    update: (labels: boolean) => void
}

const LabelsButton: React.FC<LabelsButtonProps> = ({ network, labels, update, children }) => {
    // prevents from changing labels too many times quickly
    useEffect(() => {
        const timeout = setTimeout(() => network.setLabels(labels), 100)

        return () => { clearTimeout(timeout) }
    }, [network, labels])

    return (
        <button type="button" className="btn btn-block btn-primary" onClick={() => update(!labels)}>
            {children}
        </button>
    )
}

type RatioRangeProps = {
    network: Network
    ratio: number
    update: (ratio: number) => void
}

const RatioRange: React.FC<RatioRangeProps> = ({ network, ratio, update }) => {
    // prevents from changing ratio too many times quickly
    useEffect(() => {
        const timeout = setTimeout(() => network.setRatio(ratio), 100)

        return () => { clearTimeout(timeout) }
    }, [network, ratio])

    return (
        <input
            type="range"
            min={0}
            max={1000}
            value={ratio}
            className="custom-range"
            onChange={e => update(parseInt(e.target.value))}
        />
    )
}

type NetworkContainerProps = {
    network: Network
}

const NetworkContainer: React.FC<NetworkContainerProps> = ({ network }) => {
    const ref = useRef<HTMLDivElement>(null)

    // prevents from the network to go out of the container bounds when resizing the window
    useEffect(() => {
        const resize = () => {
            const width = ref.current?.clientWidth

            if (width) network.resize(width)
        }

        window.addEventListener('resize', resize)

        return () => { window.removeEventListener('resize', resize) }
    }, [network])

    // prevents from computing multiple layout at once
    useEffect(() => () => { network.stop() }, [network])

    // attaches/removes the network to the container
    useEffect(() => {
        if (!ref.current) return

        const stage = network.container(ref.current)

        return () => { stage.remove() }
    }, [network])

    return <div ref={ref}></div>
}
