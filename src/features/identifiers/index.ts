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

export { cache } from './api'
export { reducer, actions } from './reducer'
export { parse } from './utils'
export { IdentifierCard } from './components/IdentifierCard'
