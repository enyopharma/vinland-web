export type Interaction = {
    readonly type: 'hh' | 'vh'
    readonly protein1: Interactor
    readonly protein2: Interactor
    readonly publications: { nb: number }
    readonly methods: { nb: number }
}

export type Interactor = {
    readonly type: 'h' | 'v'
    readonly accession: string
    readonly name: string
    readonly description: string
    readonly taxon: {
        readonly ncbi_taxon_id: number
        readonly name: string
    }
    readonly species: {
        readonly ncbi_taxon_id: number
        readonly name: string
    }
}
