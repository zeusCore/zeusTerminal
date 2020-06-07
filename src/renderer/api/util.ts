import axios from 'axios'
import qs from 'qs'
import toast from '@/lib/toast'

const HOST =
    process.env.NODE_ENV === 'production'
        ? 'https://zeus.passkee.com'
        : 'http://192.168.3.38:4001'

const TEST_MODE = navigator.userAgent.indexOf('TEST_MODE') > -1

const RequestErrorMsg: { [key: string]: string } = {
    Status403: '请求资源不可用！',
    Status500: '服务器繁忙，请稍后重试！',
    Other: '请求出错，请稍后再试'
}

// !silent的处理方式
function handlerError(e: any) {
    toast.error(
        e.msg ||
            e.message ||
            RequestErrorMsg[
                e.request && e.request.status
                    ? 'Status' + e.request.status
                    : 'Other'
            ]
    )
}

export const ax = axios.create({
    baseURL: HOST,
    timeout: 10000,
    responseType: 'json',
    transformRequest: [
        (data) => {
            if (data instanceof FormData) {
                return data
            }
            return qs.stringify(data)
        }
    ],
    paramsSerializer(params) {
        return qs.stringify(filterUndefinedParams(params))
    }
})
// http post method
export function postJson<T>(
    url: string,
    data?: PlainObject,
    dataType?: string,
    silent?: boolean
): Promise<T> {
    return axios
        .post(url, data, {
            params: TEST_MODE ? { _request_module_: module } : undefined,
            responseType: dataType
        })
        .then((res) => {
            return preHandle(res, silent)
        })
}

// http get method
export function get<T>(
    url: string,
    data?: PlainObject,
    dataType?: string,
    silent?: boolean
): Promise<T> {
    return ax
        .get(url, {
            params: data,
            responseType: dataType
        })
        .then((res) => {
            return preHandle(res, silent)
        })
}

// http post method
export function post<T>(
    url: string,
    data?: PlainObject,
    dataType?: string,
    silent?: boolean
): Promise<T> {
    return ax
        .post(url, data, {
            responseType: dataType
        })
        .then((res) => {
            return preHandle(res, silent)
        })
}

function preHandle(res: PlainObject, silent?: boolean) {
    return res.data
}

export function packageReq(
    _module: {
        [key: string]: {
            url: string
            method?: string
            dataType?: string
            postJson?: boolean
        }
    },
    moduleName?: string
): { [key: string]: Func } {
    const __module: { [key: string]: Func } = {}
    let k: string
    for (k in _module) {
        if (_module[k]) {
            ;((name, req) => {
                let url: string
                if (!req.method) {
                    req.method = 'GET'
                }

                if (req.url.indexOf('http') === -1) {
                    url = HOST + req.url
                } else {
                    url = req.url
                }
                req.method = req.method.toUpperCase()
                if (!req.dataType) {
                    req.dataType = 'json'
                }
                if (!__module[name]) {
                    __module[name] = async (
                        data: PlainObject, // 请求参数
                        silent: boolean = false, // 设为true屏蔽默认请求出错提示
                        rejectMode: boolean = false // 设为true请求出错将会reject处理，默认 resolve({error:e})
                    ) => {
                        let uri
                        const token = window.localStorage.token || ''
                        const timespan = window.localStorage.timespan || ''
                        const allMethods: PlainObject = {
                            GET: get,
                            POST: post
                        }
                        if (req.method === 'GET') {
                            uri = url
                            data = data || {}
                            data.token = token
                            data.timespan = timespan
                        } else {
                            if (url.includes('?')) {
                                uri =
                                    url + `&token=${token}&timespan=${timespan}`
                            } else {
                                uri =
                                    url + `?token=${token}&timespan=${timespan}`
                            }
                        }
                        const _method: Func = req.postJson
                            ? postJson
                            : allMethods[req.method ? req.method : '']
                        if (!_method) {
                            throw `[DEV] undefined request method ${req.method}`
                        }
                        if (rejectMode) {
                            const res = await _method(
                                uri,
                                data,
                                req.dataType,
                                silent
                            )
                            return res
                        } else {
                            let res: object
                            try {
                                res = await _method(
                                    uri,
                                    data,
                                    req.dataType,
                                    silent
                                )
                            } catch (e) {
                                if (!silent) {
                                    handlerError(e)
                                }
                                res = { error: e }
                            }
                            return res
                        }
                    }
                }
            })(k, _module[k])
        }
    }
    return __module
}

function filterUndefinedParams(params: any): PlainObject {
    if (typeof params === 'object') {
        for (const x in params) {
            if (params.hasOwnProperty(x)) {
                if (typeof params[x] === 'undefined') {
                    delete params[x]
                }
            }
        }
    }
    return params
}
