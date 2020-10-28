import { IdentifierList } from './types'

export const parse = (lists: IdentifierList[]) => lists.reduce((merged: string[], list: IdentifierList) => {
    return list.identifiers.split(/(,|\s|\|)+/)
        .map(i => i.trim().toUpperCase())
        .filter(i => i.length >= 2 && i.length <= 12)
        .reduce((merged, identifier) => {
            return merged.includes(identifier) ? merged : [...merged, identifier]
        }, merged)
}, [])
