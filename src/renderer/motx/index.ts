import MotX from 'motx'

const motx = new MotX({
    name: 'main',
    store: {
        recommendList: [],
        historyList: [],
        currentIndex: 0,
        leftSide: true
    },
    hooks: {
        didPublish(channel: string, args: any[]) {
            console.log('[Motx] didPublish', args)
        },
        didSetState(fieldName: string, newState, isolate: boolean, store) {
            console.log('[Motx] didSetState', fieldName, newState)
        }
    }
})

require('./select').default(motx)

export default motx
