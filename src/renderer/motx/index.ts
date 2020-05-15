import MotX from 'motx'

const motx = new MotX({
    name: 'main',
    hooks: {
        didPublish(channel: string, args: any[]) {
            console.log('[Motx] didPublish', args)
        },
        didSetState(fieldName: string, newState, isolate: boolean, store) {
            console.log('[Motx] didSetState', fieldName, newState)
        }
    }
})

export default motx
