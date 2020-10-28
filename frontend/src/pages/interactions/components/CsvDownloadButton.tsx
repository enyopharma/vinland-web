import React from 'react'

type CsvDownloadButtonProps = {
    enabled?: boolean
    csv: () => string
}

export const CsvDownloadButton: React.FC<CsvDownloadButtonProps> = ({ enabled = true, csv, children }) => {
    const prefix = 'data:text/csv;charset=utf-8,'

    const download = () => window.open(prefix + encodeURIComponent(csv()))

    return (
        <button className="btn btn-link p-0" onClick={download} disabled={!enabled}>
            {children}
        </button>
    )
}
