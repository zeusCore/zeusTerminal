import MotxVue from 'motx/dist/motx-vue'
import { TerminalType } from '@/common/constant'
export default (motx: MotxVue) => {
    motx.subscribe('control-remote', ({ cnnid, info }) => {
        motx.publish('push-terminal', {
            title: `[remote]${info.name}`,
            cnnid,
            type: TerminalType.master
        })
    })
    motx.subscribe('remote-control', ({ cnnid, info }) => {
        motx.publish('push-terminal', {
            title: `[remote]`,
            cnnid,
            type: TerminalType.slave
        })
    })
    motx.subscribe('close-connection', (id, cnnid) => {
        motx.publish('delete-terminal', id)
    })
    motx.subscribe('close-controled', (id, cnnid) => {
        motx.publish('delete-terminal', id)
    })
}
