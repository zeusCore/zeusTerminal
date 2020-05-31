import { session } from 'electron'

export default new (class Session {
    private _session: any = null
    public get session() {
        if (this._session) {
            this.initSession()
        }
        return this._session
    }
    public async initSession() {
        // this._session = session.fromPartition('persist:zeus', { cache: true })
        this._session = session.defaultSession
    }
})()
