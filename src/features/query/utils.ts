import { QueryResult, QueryResultStatuses, SuccessfulQueryResult, Interaction, Protein } from './types'

export function isSuccessfulQueryResult(result: QueryResult): result is SuccessfulQueryResult {
    return result.status === QueryResultStatuses.SUCCESS
}

export const proteins2csv = (proteins: Protein[], sep: string = "\t") => {
    const headers = ['type', 'accession', 'name', 'taxon']

    const fields = (p: Protein) => [p.type, p.accession, p.name, p.taxon.name]

    return `#${headers.join(sep)}\n${proteins.map(p => fields(p).join(sep)).join("\n")}`
}

export const interactions2csv = (interactions: Interaction[], sep: string = "\t") => {
    const headers = ['type', 'accession1', 'name1', 'taxon1', 'accession2', 'name2', 'taxon2']

    const fields = (i: Interaction) => [
        i.type,
        i.protein1.accession, i.protein1.name, i.protein1.taxon.name,
        i.protein2.accession, i.protein2.name, i.protein2.taxon.name,
    ]

    return `#${headers.join(sep)}\n${interactions.map(i => fields(i).join(sep)).join("\n")}`
}
