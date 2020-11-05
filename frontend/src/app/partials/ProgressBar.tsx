import React from 'react'

type ProgressBarProps = {
    type?: 'primary' | 'info' | 'danger'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ type = 'primary' }) => {
    const classes = `progress-bar progress-bar-striped progress-bar-animated bg-${type}`

    return (
        <div className="progress">
            <div className={classes} style={{ width: '100%' }}></div>
        </div>
    )
}
