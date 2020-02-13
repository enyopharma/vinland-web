export type Annotation = {
    source: string
    ref: string
    name: string
    accessions: string[]
}

export type IdentifierList = {
    i: number
    name: string
    identifiers: string
}

export * from './api'
export * from './reducer'
export * from './utils'
export * from './components/IdentifierCard'
