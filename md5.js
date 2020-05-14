const builder = require('electron-builder')
const crypto = require('crypto')
const glob = require('glob')
const fs = require('fs-extra')
const path = require('path')

const files = glob.sync('./build/*.exe').concat(glob.sync('./build/*.dmg'))
const promises = files.map((filePath) => {
    return md5(path.join(__dirname, filePath))
})

Promise.all(promises).then((data) => {
    let map = ''
    files.forEach((item, index) => {
        map += item.split(/[\/\\]/g).pop() + ' : ' + data[index] + '\n'
    })
    fs.writeFileSync(path.join(__dirname, './build/md5.txt'), map)
    console.log(map)
})

function md5(filePath) {
    return new Promise((r, rj) => {
        const md5sum = crypto.createHash('md5')
        const stream = fs.createReadStream(filePath)
        stream.on('data', function(chunk) {
            md5sum.update(chunk)
        })
        stream.on('end', function() {
            r(md5sum.digest('hex').toUpperCase())
        })
        stream.on('error', function() {
            rj()
        })
    })
}
