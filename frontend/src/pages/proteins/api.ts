import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { Protein, Isoform, Interaction } from './types'

const limit = 20

const protein = cache<Protein>()
const proteins = cache<Protein[]>()
const isoforms = cache<Isoform[]>()
const interactions = cache<Interaction[]>()

export const resources = {
    protein: (id: number) => {
        return protein.resource(id, () => fetchProtein(id), 300)
    },

    proteins: (type: string, query: string) => {
        if (type.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return proteins.resource(`${type}:${query}`, () => fetchProteins(type, query), 300)
    },

    isoforms: (protein_id: number) => {
        return isoforms.resource(`${protein_id}`, () => fetchIsoforms(protein_id), 300)
    },

    interactions: (type: 'hh' | 'vh', protein_id: number, isoform_id: number) => {
        return interactions.resource(`${type}:${protein_id}:${isoform_id}`, () => fetchInteractions(type, protein_id, isoform_id), 300)
    },
}

const fetchProtein = async (id: number) => {
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/proteins/${id}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }
}

const fetchProteins = async (type: string, query: string) => {
    const querystr = qs.encode({ type: type, query: query, limit: limit })
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/proteins?${querystr}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }

    return []
}

const fetchIsoforms = async (protein_id: number) => {
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/proteins/${protein_id}/isoforms`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }

    return []
}

const fetchInteractions = async (type: 'hh' | 'vh', protein_id: number, isoform_id: number) => {
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/proteins/${protein_id}/isoforms/${isoform_id}/interactions/${type}`, params)
        const json = await response.json()

        if (!json.success) {
            throw new Error(json)
        }

        return json.data
    }

    catch (error) {
        console.log(error)
    }
}
