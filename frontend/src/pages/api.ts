import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { Protein, Isoform, Interactor } from './types'

const limit = 20

const protein = cache<[Protein, Isoform[]]>()
const proteins = cache<Protein[]>()
const interactors = cache<Interactor[]>()

export const resources = {
    protein: (id: number) => {
        return protein.resource(id, async () => {
            const protein = await fetchProtein(id)
            const isoforms = await fetchIsoforms(id)

            return [protein, isoforms]
        })
    },

    proteins: (type: string, query: string) => {
        if (type.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return proteins.resource(`${type}:${query}`, () => fetchProteins(type, query), 300)
    },

    interactors: (protein_id: number, type: 'h' | 'v') => {
        return interactors.resource(`${protein_id}:${type}`, () => fetchInteractors(protein_id, type))
    },
}

const fetchProtein = async (id: number) => {
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/proteins/${id}`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}

const fetchProteins = async (type: string, query: string): Promise<Protein[]> => {
    const querystr = qs.encode({ type, query, limit })
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/proteins?${querystr}`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}

const fetchIsoforms = async (protein_id: number): Promise<Isoform[]> => {
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/proteins/${protein_id}/isoforms`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}

const fetchInteractors = async (protein_id: number, type: 'h' | 'v'): Promise<Interactor[]> => {
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/proteins/${protein_id}/interactors/${type}`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}
