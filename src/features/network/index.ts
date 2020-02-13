type Node = {
    data: {
        id: string
        type: 'h' | 'v'
        name: string
    }
}

type Edge = {
    data: {
        source: string
        target: string
    }
}

export type Element = Node | Edge

export * from './components/NetworkD3'
