import MotX from 'motx'

export default (motx: MotX) => {
    motx.subscribe('xterm-onkey', (key) => {
        const index = motx.getState('currentIndex')
        const leftSide = motx.getState('leftSide')
        switch (key) {
            case 'ArrowDown':
                break
            case 'ArrowUp':
                break
            case 'ArrowLeft':
                break
            case 'ArrowRight':
                break
        }
    })
}
