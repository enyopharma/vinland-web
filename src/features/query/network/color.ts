import { scaleOrdinal } from 'd3-scale'
import { schemeSpectral } from 'd3-scale-chromatic'
import { Protein } from 'features/query'

const scale = scaleOrdinal(schemeSpectral[11])

export const getColorPicker = () => {
    let first_viral_species: number | null = null

    return (protein: Protein) => {
        if (protein.type === 'h') {
            return 'blue'
        }

        if (first_viral_species === null) {
            first_viral_species = protein.species.ncbi_taxon_id
        }

        if (protein.species.ncbi_taxon_id === first_viral_species) {
            return 'red'
        }

        return scale(protein.species.ncbi_taxon_id.toString())
    }
}
