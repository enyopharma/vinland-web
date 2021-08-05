import qs from 'querystring'
import fetch from 'cross-fetch'
import { cache } from 'app/cache'

import { Protein, Isoform, Feature, Interactor, Interaction, Description } from './types'

const limit = 20

const protein = cache<Protein>()
const proteins = cache<Protein[]>()
const isoforms = cache<Isoform[]>()
const features = cache<Feature[]>()
const interactors = cache<Interactor[]>()
const interaction = cache<Interaction>()
const descriptions = cache<Description[]>()

export const resources = {
    protein: (id: number) => {
        return protein.resource(id, () => fetchProtein(id))
    },

    proteins: (type: string, query: string) => {
        if (type.trim().length === 0) return { read: () => [] }
        if (query.trim().length === 0) return { read: () => [] }

        return proteins.resource(`${type}:${query}`, () => fetchProteins(type, query), 300)
    },

    isoforms: (id: number) => {
        return isoforms.resource(id, () => fetchIsoforms(id))
    },

    features: (protein_id: number, isoform_id: number) => {
        return features.resource(`${protein_id}:${isoform_id}`, () => fetchFeatures(protein_id, isoform_id))
    },

    interactors: (protein_id: number, type: 'h' | 'v') => {
        return interactors.resource(`${protein_id}:${type}`, () => fetchInteractors(protein_id, type))
    },

    interaction: (id: number) => {
        return interaction.resource(id, () => fetchInteraction(id))
    },

    descriptions: (interaction_id: number) => {
        return descriptions.resource(interaction_id, () => fetchDescriptions(interaction_id))
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

const fetchFeatures = async (protein_id: number, isoform_id: number): Promise<Feature[]> => {
    const params = { headers: { accept: 'application/json' } }
    console.log(`/api/proteins/${protein_id}/isoforms/${isoform_id}/features`)
    const response = await fetch(`/api/proteins/${protein_id}/isoforms/${isoform_id}/features`, params)
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

const fetchInteraction = async (id: number): Promise<Interaction> => {
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/interactions/${id}`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}

const fetchDescriptions = async (interaction_id: number): Promise<Description[]> => {
    const params = { headers: { accept: 'application/json' } }

    const response = await fetch(`/api/interactions/${interaction_id}/descriptions`, params)
    const json = await response.json()

    if (!json.success) {
        throw new Error(json)
    }

    return json.data
}
