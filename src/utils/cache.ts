type Key = number | string

type Resource<T> = {
    readonly read: () => T
}

type Cache<T> = {
    readonly resource: (key: Key, factory: () => Promise<T>, delay?: number) => Resource<T>
}

enum ResourceStatuses { PENDING, SUCCESS, FAILURE }

export const newCache = <T>(): Cache<T> => {
    const map: Record<Key, Resource<T>> = {}

    return {
        resource: (key, factory, delay = 0) => {
            if (!map[key]) {
                map[key] = newResource<T>(withTimeout(factory(), delay))
            }
            return map[key]
        }
    }
}

export const newResource = <T>(promise: Promise<T>) => {
    let status = ResourceStatuses.PENDING
    let result: T
    let suspender = promise.then(
        r => {
            status = ResourceStatuses.SUCCESS
            result = r
        },
        e => {
            status = ResourceStatuses.FAILURE
            result = e
        }
    )

    return {
        read: () => {
            switch (status) {
                case ResourceStatuses.PENDING:
                    throw suspender
                case ResourceStatuses.FAILURE:
                    throw result
                case ResourceStatuses.SUCCESS:
                    return result
                default:
                    throw new Error()
            }
        }
    }
}

const withTimeout = <T>(promise: Promise<T>, delay: number) => {
    return delay === 0 ? promise : new Promise<T>(resolve => {
        setTimeout(() => promise.then(resolve), delay)
    })
}
