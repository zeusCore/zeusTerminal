import cacheManager from '#/lib/cacheManager'

export default async (motx) => {
    motx.subscribe('page-mounted', async ({ target }) => {
        if (target === 'setting') {
            // motx.publish(
            //     'dispatch: app/setCacheSize',
            //     await cacheManager.getSize()
            // )
        }
    })

    motx.subscribe('clear-cache', async (data: any) => {
        await cacheManager.clearCache()
        // motx.publish('dispatch: app/setCacheSize', await cacheManager.getSize())
        motx.pipe('setting').publish('cache-cleared', 0)
    })
}
