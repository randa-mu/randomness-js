export function withTimeout<T>(inner: Promise<T>, timeoutMs: number, message = "timed out"): Promise<T> {
    return Promise.race([
        inner,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(message), timeoutMs)
        )
    ])
}
