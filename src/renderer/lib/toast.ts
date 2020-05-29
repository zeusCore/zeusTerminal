'use strict'
export default {
    success(msg) {
        toast({ content: msg, background: '#10bb88', color: '#fff' })
    },
    error(msg) {
        toast({ content: msg, background: '#FF6347', color: '#fff' })
    },
    info(msg) {
        toast({ content: msg, background: '#ecbb30', color: '#fff' })
    }
}

function toast(options) {
    const id: string =
        Date.now() +
        Math.random()
            .toString()
            .replace(/\./g, '')
    const tpl = `<span id="${id}" style="
        display: inline-block;
        opacity: 0;
        position: fixed;
        padding: 5px 10px;
        background: ${options.background};
        font-size: 13px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: ${options.color};
        left: 50%;
        top: 80px;
        z-index: 100001;
        transition: all .5s;
        -webkit-transition: all .5s;
        -moz-transition: all .5s;
        -webkit-transform: translate3d(-50%,-50%,0);
        -moz-transform: translate3d(-50%,-50%,0);
        transform: translate3d(-50%,-50%,0)
    ">${options.content}</span>`
    const el = document.createElement('div')
    el.innerHTML = tpl
    console.log({ el })
    const box: any = el.firstElementChild
    document.body.appendChild(box)
    setTimeout(() => {
        box.style.opacity = 0.9
    }, 10)
    setTimeout(() => {
        box.style.opacity = 0
        setTimeout(() => {
            document.body.removeChild(box)
        }, 500)
    }, 3000)
}
