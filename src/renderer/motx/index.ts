import MotX from 'motx/dist/motx-vue'

const motx = new MotX({
    name: 'main',
    store: {
        recommendList: [
            'git add .',
            'ls',
            'cd ..',
            "git commit -m ''",
            'git push'
        ],
        historyList: [
            '3333333',
            'sdfsdf',
            '33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333',
            'sdfsdf',
            'sdfsdf'
        ],
        currentIndex: -1, // -1: 没有激活选项
        currentInput: '',
        leftSide: true
    },
    hooks: {
        didPublish(channel: string, args: any[]) {
            // console.log('[Motx] didPublish', args)
        },
        didSetState(fieldName: string, newState, isolate: boolean, store) {
            // console.log('[Motx] didSetState', fieldName, newState)
        }
    }
})

require('./select').default(motx)

export default motx
