import MotX from 'motx/dist/motx-vue'
import data from '../data/cmds'
import calc from '../lib/calc-input'

const cmds = data.split('\n').map((item) => item.trim()).filter((item) => !!item)

export default (motx: MotX) => {

    motx.subscribe('tips-click', ({ cmd, index, leftSide }) => {
        motx.setState('leftSide', leftSide)
        motx.setState('currentIndex', index)
    })

    motx.subscribe('currentIndex@change', (val) => {
        if (val > -1) {
            const leftSide = motx.getState('leftSide')
            const list = motx.getState(leftSide ? 'recommendList' : 'historyList')
            const cmd = list[val].split('#')[0].trim()
            motx.setState('currentInput', cmd)
        }
    })
    motx.subscribe('leftSide@change', (val) => {
        const index = motx.getState('currentIndex')
        if (index > -1) {
            const list = motx.getState(val ? 'recommendList' : 'historyList')
            const cmd = list[index].split('#')[0].trim()
            motx.setState('currentInput', cmd)
        }
    })

    motx.subscribe('xterm-input', (input) => {
        const index = motx.getState('currentIndex')
        motx.setState('currentInput', input)
        if (index === -1) {
            const res = calc(cmds, input)
            motx.setState('recommendList', res)
        }
    })


    motx.subscribe('xterm-onkey', (key) => {
        switch (key) {
            case 'ArrowDown':
                motx.setState('currentIndex', 0)
                motx.publish('tipts-focus')
                break
        }
    })

    motx.subscribe('tips-onkey', (key) => {
        console.log('tips-onkey', key)
        let index = motx.getState('currentIndex')
        let leftSide = motx.getState('leftSide')
        if (index > -1) {
            switch (key) {
                case 'ArrowDown':
                    if (index < 4) {
                        index++
                    }
                    break
                case 'ArrowUp':
                    if (index > 0) {
                        index--
                    } else {
                        index = -1
                    }
                    break
                case 'ArrowLeft':
                    leftSide = true
                    break
                case 'ArrowRight':
                    leftSide = false
                    break
            }
            motx.setState('currentIndex', index)
            motx.setState('leftSide', leftSide)
            if (index === -1) {
                motx.publish('xterm-focus-from-tips', '')

            }
        }
    })

}
