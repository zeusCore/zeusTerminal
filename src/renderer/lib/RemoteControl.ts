import API from '@/api'
import EventEmitter from 'eventemitter3'
import io, { socket } from 'socket.io-client'
import motx from '@/motx'
export default class RemoteControl extends EventEmitter {
    public static async listen() {
        localStorage.token = 'slave'
        localStorage.timespan = '321'
        const { data, code, error } = await API.remote.addStandby({
            name: 'steven-oa-mac'
        })
        if (data) {
            const interv = setInterval(async () => {
                localStorage.token = 'slave'
                localStorage.timespan = '321'
                const { data, code, error } = await API.remote.checkout()
                if (data && data.connect) {
                    clearInterval(interv)
                    motx.publish('remote-control', {
                        cnnid: data.connect
                    })
                }
            }, 5000)
        }
    }
    public cnnid: string = ''
    protected listening: boolean = false
    protected sockit: socket
    constructor(cnnid) {
        super()
        this.cnnid = cnnid
        this.mkSocket()
    }

    public send(data) {
        this.sockit.send({ action: 't', data })
    }

    public disconnect() {
        this.sockit.send({ action: 'disconnect' })
    }

    public mkSocket() {
        const socket = (this.sockit = io(
            `http://192.168.3.38:4001?master=0&cnnid=${
                this.cnnid
            }&token=${'slate'}`
        ))
        socket.on('connect', () => {
            setTimeout(() => {
                socket.send({
                    action: 'standby-ready'
                })
            }, 100)

            setInterval(() => {
                socket.send({
                    action: 't',
                    data: 'fuck'
                })
            }, 5000)
        })
        socket.on('master-ready', () => {
            this.emit('master-ready')
        })
        socket.on('resize', (data) => {
            console.log(data)
            this.emit('resize', data)
        })
        socket.on('t', (data) => {
            console.log(data)
            this.emit('data', data)
        })
        socket.on('disconnect', function() {
            console.log('disconnect')
        })
    }
}
