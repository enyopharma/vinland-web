import React from 'react'

type Props = {
    type?: 'primary' | 'info' | 'danger'
}

export const ProgressBar: React.FC<Props> = ({ type = 'primary' }) => (
    <div className="progress">
        <div
            className={`progress-bar progress-bar-striped progress-bar-animated bg-${type}`}
            style={{ width: '100%' }}
        ></div>
    </div>
)
