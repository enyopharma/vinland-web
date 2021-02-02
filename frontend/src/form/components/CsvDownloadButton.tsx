import React from 'react'

type CsvDownloadButtonProps = {
    name: string
    csv: () => string
    enabled?: boolean
}

export const CsvDownloadButton: React.FC<CsvDownloadButtonProps> = ({ name, csv, enabled = true, children }) => (
    <button className="btn btn-link p-0" onClick={() => download(name, csv)} disabled={!enabled}>
        {children}
    </button>
)

const download = (name: string, csv: () => string) => {
    const elem = document.createElement('a')
    elem.download = name
    elem.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv())
    elem.target = '_blank';
    elem.click()
}
