export const getLabels = () => {
    let current = false
    let listener: (() => any) | null = null

    const visibility = () => current

    const setVisibility = (value: boolean) => {
        if (value === current) return
        current = value
        if (listener === null) return
        listener()
    }

    const register = (fn: () => any) => listener = fn

    return { visibility, setVisibility, register }
}
