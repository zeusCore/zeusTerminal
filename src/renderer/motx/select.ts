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
        const index = motx.getState('currentIndex')
        if (index > -1) {
            switch (key) {
                case 'ArrowDown':
                    motx.setState('currentIndex', index + 1)
                    break
                case 'ArrowUp':
                    if (index > 0) {
                        motx.setState('currentIndex', index - 1)
                    } else {
                        motx.setState('currentIndex', -1)
                        motx.publish('xterm-focus-from-tips', '')
                    }
                    break
                case 'ArrowLeft':
                    motx.setState('leftSide', true)
                    break
                case 'ArrowRight':
                    motx.setState('leftSide', false)
                    break
            }
        }
    })

}
