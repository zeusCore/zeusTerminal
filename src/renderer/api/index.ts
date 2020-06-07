import { packageReq } from './util'

// 自动挂载模块
const modules: { [key: string]: { [key: string]: Func } } = {}

const _modules = require.context('./modules', true, /\.ts$/)

_modules.keys().forEach((item: string) => {
    const _module = _modules(item).default
    const path = item.split(/[\\\/]/g)
    const moduleName = path[path.length - 1].split(/\./g)[0]
    modules[moduleName] = packageReq(_module, moduleName)
})

// console.log('api modules', modules)

export default Object.assign({}, modules)
