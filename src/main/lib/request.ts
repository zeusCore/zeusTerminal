import { net } from 'electron'
import fs from 'fs-extra'
export default {
    post(url: string, data: any, dataType: string = 'json'): Promise<any> {
        return new Promise((r, rj) => {
            const res: any = []
            console.log('post(url: string, data: any)', data)
            const request = net.request({
                url,
                method: 'POST',
                dataType: 'json'
            })
            request.setHeader('Content-Type', 'application/json;charset=UTF-8')
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    res.push(chunk)
                })
                response.on('end', () => {
                    if (dataType === 'json') {
                        try {
                            r(JSON.parse(res.join('')))
                        } catch (e) {
                            rj(e)
                        }
                    } else {
                        r(res.join(''))
                    }
                })
            })
            request.on('error', (e) => {
                rj(e)
            })
            request.end(JSON.stringify(data))
        })
    },
    get(url, dataType: 'json' | 'text'): Promise<any> {
        return new Promise((r, rj) => {
            const res: any = []
            const request = net.request(url)
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    res.push(chunk)
                })
                response.on('end', () => {
                    if (dataType === 'json') {
                        try {
                            r(JSON.parse(res.join('')))
                        } catch (e) {
                            rj(e)
                        }
                    } else {
                        r(res.join(''))
                    }
                })
            })
            request.on('error', (e) => {
                rj(e)
            })
            request.end()
        })
    },
    download(url, dest) {
        return new Promise((r, rj) => {
            const temp = dest + '.temp'
            if (fs.existsSync(temp)) {
                fs.removeSync(temp)
                console.log('file removed', temp)
            }
            const request = net.request(url)
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    fs.appendFileSync(temp, chunk)
                })
                response.on('end', () => {
                    fs.renameSync(temp, dest)
                    r()
                })
            })
            request.on('error', (e) => {
                rj(e)
            })
            request.end()
        })
    }
}
