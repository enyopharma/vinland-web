type Node = {
    readonly data: {
        readonly id: string
        readonly type: 'h' | 'v'
        readonly name: string
    }
}

type Edge = {
    readonly data: {
        readonly source: string
        readonly target: string
    }
}

export type Element = Node | Edge

export * from './components/NetworkD3'
