import ses from '#/lib/session'

export default new (class {
    public getSize() {
        return new Promise((r, rj) => {
            ses.session.getCacheSize((size) => {
                r(size)
            })
        })
    }

    public clearCache() {
        return new Promise((r, rj) => {
            ses.session.clearCache(r)
        })
    }

    public clearStorageData() {
        return new Promise((r, rj) => {
            ses.session.clearStorageData(
                {
                    storages: [
                        'appcache',
                        'filesystem',
                        'indexdb',
                        'shadercache',
                        'websql',
                        'serviceworkers'
                    ]
                },
                r
            )
        })
    }
})()
