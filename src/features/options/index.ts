export type Options = {
    readonly hh: boolean
    readonly vh: boolean
    readonly neighbors: boolean
    readonly publications: number
    readonly methods: number
}

export { reducer, actions } from './reducer'
export { OptionsCard } from './components/OptionsCard'
