import API from '@/api'
import EventEmitter from 'eventemitter3'
import io, { socket } from 'socket.io-client'
import motx from '@/motx'
export default class ControlRemote extends EventEmitter {
    public static async connect(details) {
        localStorage.token = 'master'
        localStorage.timespan = '123'
        const { data } = await API.remote.createConnect({
            standbyId: details.id
        })
        if (data && data.id) {
            motx.publish('control-remote', {
                cnnid: data.id,
                info: details
            })
        }
    }
    public cnnid: string = ''
    protected sockit: socket = null
    constructor(cnnid: string) {
        super()
        this.cnnid = cnnid
        this.mkSocket()
    }

    public send(data) {
        this.sockit.send({ action: 't', data })
    }

    public resize(cols, rows) {
        this.sockit.send({ action: 'resize', data: { rows, cols } })
    }

    public disconnect() {
        this.sockit.send({ action: 'disconnect' })
    }

    public mkSocket() {
        const socket = (this.sockit = io(
            `http://192.168.3.38:4001?master=1&cnnid=${
                this.cnnid
            }&token=${'master'}`
        ))
        socket.on('connect', () => {
            console.log('connect')
            setTimeout(() => {
                socket.send({ action: 'master-ready' })
            }, 100)
            this.emit('connect')
        })
        socket.on('slave-ready', () => {
            this.emit('slave-ready')
        })
        socket.on('t', (data) => {
            console.log(data)
            this.emit('data', data)
        })
        socket.on('disconnect', () => {
            this.emit('disconnect')
        })
    }
}
