import React from 'react'

type Props = {
    display: boolean
}

export const Overlay: React.FC<Props> = ({ display, children }) => {
    return !display ? null : (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%', zIndex: 100 }}>
                {children}
            </div>
        </div>
    )
}
