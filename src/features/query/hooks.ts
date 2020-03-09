import { useState } from 'react'

const last: Record<string, any> = []

export const usePersistentState = <T = any>(key: string, init: T, deps: any[] = []) => {
    const same = deps.length === 0 || deps.every((dep, i) => last[`${key}:${i}`] === dep)
    const hook = useState<T>(last[key] && same ? last[key] as T : init)

    const [state, setState] = hook

    if (!same && state !== init) {
        setState(init)
    }

    last[key] = state
    deps.forEach((dep, i) => { last[`${key}:${i}`] = dep })

    return hook
}
