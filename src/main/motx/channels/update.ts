import updateTips from '#/lib//updateTips'
export default (motx) => {
    motx.subscribe('goto-install', ({ downloadInBrowser }) => {
        if (downloadInBrowser) {
            updateTips.gotoDownload()
        } else {
            updateTips.install()
        }
    })
}
