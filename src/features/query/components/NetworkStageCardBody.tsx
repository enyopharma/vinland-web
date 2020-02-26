import React, { useEffect, useRef } from 'react'

import { Network } from 'features/query'

type Props = {
    network: Network
}

export const NetworkStageCardBody: React.FC<Props> = ({ network }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        return () => { network.stop() }
    }, [network])

    useEffect(() => {
        if (ref.current === null) return

        const stage = network.container(ref.current)

        return () => { stage.remove() }
    }, [network])

    useEffect(() => {
        const resize = () => {
            if (ref.current === null) return
            network.resize(ref.current.clientWidth)
        }

        window.addEventListener('resize', resize)

        return () => { window.removeEventListener('resize', resize) }
    }, [network])

    return (
        <div className="card-body">
            <div ref={ref}></div>
        </div>
    )
}
