import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { Protein, Isoform, Interactor } from './types'

const limit = 20

const protein = cache<Protein>()
const proteins = cache<Protein[]>()
const isoforms = cache<Isoform[]>()
const interactors = cache<Interactor[]>()

export const resources = {
    protein: (id: number) => {
        return protein.resource(id, () => fetchProtein(id))
    },

    proteins: (type: string, query: string) => {
        if (type.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return proteins.resource(`${type}:${query}`, () => fetchProteins(type, query), 300)
    },

    isoforms: (protein_id: number) => {
        return isoforms.resource(`${protein_id}`, () => fetchIsoforms(protein_id))
    },

    interactors: (type: 'h' | 'v', protein_id: number, isoform_id: number) => {
        return interactors.resource(`${type}:${protein_id}:${isoform_id}`, () => fetchInteractors(type, protein_id, isoform_id))
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

const fetchInteractors = async (type: 'h' | 'v', protein_id: number, isoform_id: number): Promise<Interactor[]> => {
    const querystr = qs.encode({ isoform_id })
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/proteins/${protein_id}/interactors/${type}?${querystr}`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}
