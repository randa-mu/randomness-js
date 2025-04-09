export function withTimeout<T>(inner: Promise<T>, timeoutMs: number, message = "timed out"): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeout: any = null
    return Promise.race([
        inner,
        new Promise<T>((_, reject) =>
            timeout = setTimeout(() => reject(message), timeoutMs)
        )
    ]).finally(() => clearTimeout(timeout))
}
