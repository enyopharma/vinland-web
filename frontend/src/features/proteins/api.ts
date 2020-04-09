import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'utils/cache'

import { Protein, Isoform } from './types'

const limit = 20

const protein = cache<Protein>()
const isoform = cache<Isoform>()
const proteins = cache<Protein[]>()

export const resources = {
    protein: (id: number) => {
        return protein.resource(id, () => fetchProtein(id), 300)
    },

    isoform: (protein_id: number, id: number) => {
        return isoform.resource(`${protein_id}:${id}`, () => fetchIsoform(protein_id, id), 300)
    },

    proteins: (type: string, query: string) => {
        if (type.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return proteins.resource(`${type}:${query}`, () => fetchProteins(type, query), 300)
    }
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

const fetchIsoform = async (protein_id: number, id: number) => {
    const params = { headers: { accept: 'application/json' } }

    try {
        const response = await fetch(`/api/proteins/${protein_id}/isoforms/${id}`, params)
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
