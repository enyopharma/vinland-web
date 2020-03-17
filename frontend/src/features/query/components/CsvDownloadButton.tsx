import React from 'react'

type Props = {
    csv: () => string
}

export const CsvDownloadButton: React.FC<Props> = ({ csv, children }) => {
    const prefix = 'data:text/csv;charset=utf-8,'

    const download = () => window.open(prefix + encodeURIComponent(csv()))

    return (
        <button className="btn btn-link p-0" onClick={download}>
            {children}
        </button>
    )
}
