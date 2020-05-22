import MotX from 'motx/dist/motx-vue'

export default (motx: MotX) => {
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
                    index++
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
