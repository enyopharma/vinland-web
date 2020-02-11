export type Annotation = {
    readonly source: string
    readonly ref: string
    readonly name: string
    readonly accessions: string[]
}

export type IdentifierList = {
    readonly i: number
    readonly name: string
    readonly identifiers: string
}

export * from './api'
export * from './reducer'
export * from './utils'
export * from './components/IdentifierCard'
