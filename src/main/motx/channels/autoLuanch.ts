import regEditor from '#/lib/regEditor'

export default async (motx) => {
    motx.subscribe('page-mounted', async ({ target }) => {
        if (target === 'setting') {
            // motx.publish(
            //     'dispatch : app/setAutoLaunch',
            //     await regEditor.getAutoLaunchStatus()
            // )
        }
    })

    motx.subscribe('set-auto-launch', async (yes: boolean) => {
        await regEditor.setAutoLaunch(yes)
        // motx.publish(
        //     'dispatch : app/setAutoLaunch',
        //     await regEditor.getAutoLaunchStatus()
        // )
    })
}
