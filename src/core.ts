type CoreT = {
    store: Awaited<ReturnType<typeof getStorage>> | null,
}

const core: CoreT = {
    store: null,
}