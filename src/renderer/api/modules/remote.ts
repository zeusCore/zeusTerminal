export default {
    createConnect: {
        url: '/api/v1/connection/create',
        method: 'post'
    },
    standbyList: {
        url: '/api/v1/standby/list'
    },
    addStandby: {
        url: '/api/v1/standby/add',
        method: 'post'
    },
    removeStandby: {
        url: '/api/v1/standby/remove',
        method: 'post'
    },
    checkout: {
        url: '/api/v1/standby/checkout',
        method: 'post'
    }
}
