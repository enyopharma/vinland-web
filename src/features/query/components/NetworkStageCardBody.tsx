import React, { useEffect, useRef } from 'react'

import { Network } from 'features/query'

type Props = {
    network: Network
}

export const NetworkStageCardBody: React.FC<Props> = ({ network }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const resize = () => {
            const width = ref.current?.clientWidth

            width && network.resize(width)
        }

        window.addEventListener('resize', resize)

        return () => { window.removeEventListener('resize', resize) }
    })

    useEffect(() => {
        if (ref.current) {
            const stage = network.container(ref.current)

            return () => {
                network.stop()
                stage.remove()
            }
        }
    }, [network])

    return (
        <div className="card-body">
            <div ref={ref}></div>
        </div>
    )
}
