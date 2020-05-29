import toast from '@/lib/toast'
import MotxVue from 'motx/dist/motx-vue'
export default (motx: MotxVue) => {
    motx.subscribe('toast', ({ type, message }) => {
        const toastType = toast[type]
        if (toastType) {
            toastType(message)
        } else {
            throw new Error('cannot find toast type ' + type)
        }
    })
}
