import os from 'os'
import { ipcRenderer } from "electron"
import iconv from  'iconv-lite'
import { exec } from 'child_process'
import React from 'react'
import { store, history } from '../index'
import { Modal, Input, message } from 'antd'
import crypto from 'crypto'
import { cLogout } from '../redux/reducers/user'

export const hasClass = (elem, cls) => {
    if(elem) {
        return !!elem.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    } else {
        return false
    }
}

//移除类名
export const removeClass = (elem, cls) => {
    if (!!elem && hasClass(elem, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        elem.className = elem.className.replace(reg, '')
    }
}

//添加类名
export const addClass = (elem, cls) => {
    if (!!elem && !hasClass(elem, cls)) {
        elem.className += " " + cls
    }
}

//延时
export const delay = (ms, todo, err) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(!!todo) todo()

            if(!!err) {
                reject(err)
            } else {
                resolve()
            }
        }, ms)
    })
}

//跳转
export const jump = (path) => {
    const { user, router } = store.getState()
    let pathname = ''
    if(!!router.location) {
        pathname = router.location.pathname
    }
    if(pathname !== path) {
        if(user.get('lock')) {
            getInput('请输入操作密码', '操作密码', 'password', (pass) => {
                const md5 = crypto.createHash('md5')
                md5.update(pass)
                const str = md5.digest('hex')
                if(user.get('lockPass') === str) {
                    history.push(path)
                } else {
                    message.error('操作密码错误!')
                }
            })
        } else {
            history.push(path)
        }
    }
}

//GET
export const fetchGet = (url, params, headers = {}, timeout = 5000) => {
    const netPromise = new Promise((resolve, reject)=> {
        fetch(url + objToUrlParams(params), {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            }
        }).then((response) => {
            return response.json()
        }).then(json => {
            if(json.code === 200) {
                resolve(json)
            } else if (json.code === 1002) {
                message.error('登陆过期，请重新登陆。')
                store.dispatch(cLogout())
                reject()
            }  else {
                throw new Error(json.code)
            }
        }).catch(e => {
            reject(e, '请求失败')
        })
    })
    const timeoutPromise = delay(timeout, null, new Error('请求超时'))
    return Promise.race([netPromise, timeoutPromise])
}

//POST
export const fetchPost = (url, params, headers = {}, timeout = 5000) => {
    const netPromise = new Promise((resolve, reject)=> {
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(params)
        }).then((response) => {
            return response.json()
        }).then(async json => {
            if(json.code === 200) {
                resolve(json)
            } else if (json.code === 1002) {
                message.error('登陆过期，请重新登陆。')
                store.dispatch(cLogout())
                reject()
            } else {
                throw new Error(json.code)
            }
        }).catch(e => {
            reject(e, '请求失败')
        })
    })
    const timeoutPromise = delay(timeout, null, new Error('请求超时'))
    return Promise.race([netPromise, timeoutPromise])
}

//object转换成url参数
const objToUrlParams = (obj) => {
    if(obj) {
        let utlParams = '?'
        for (let i in obj) {
            utlParams += i + '=' + obj[i] + '&'
        }
        return utlParams.substr(0, utlParams.length - 1)
    }
    return ''
}

//判断是否某个元素的子元素
export const isParent =  (obj, parentObj) =>{
    if(obj === parentObj) return false
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY'){
        if (obj == parentObj){
            return true
        }
        obj = obj.parentNode
    }
    return false
}

//rem转px
export const rem2px = (rem) => {
    const clientWidth = parseFloat(document.documentElement.clientWidth)
    return parseFloat(clientWidth / 10 * rem)
}

//浅拷贝
export const simpleClone = (initObj) => {
    let obj = {}
    for (let i in initObj) {
        obj[i] = initObj[i]
    }
    return obj
}

//递归获取父节点指定属性
export const recursionGetAttr = (elem, attr) => {
    return new Promise((resolve, reject) => {
        const recursion = (elem, attr) => {
            if(!elem.getAttribute(attr)) {
                if(elem.parentNode.getAttribute) {
                    recursion(elem.parentNode, attr)
                } else {
                    reject('未找到属性')
                }
            } else {
                resolve({attr: elem.getAttribute(attr), elem})
            }
        }

        const recursionArr = (_elem, attrArray) => {
            let attr = [], elem = null
            attrArray.map(v => {
                if(_elem.getAttribute(v)) {
                    elem = _elem
                    attr.push(_elem.getAttribute(v))
                }
            })
            if(attr.length > 0) {
                resolve({attr, elem})
            } else {
                if(_elem.parentNode.getAttribute) {
                    recursionArr(_elem.parentNode, attrArray)
                } else {
                    reject('未找到属性')
                }
            }
        }

        if(typeof attr === 'string') {
            recursion(elem, attr)
        } else {
            recursionArr(elem, attr)
        }
    })
}

//全局模态框获取输入框输入
export const getInput = (title = '', placeholder = '', type = '', todo) => {
    let inputTmp = ''
    Modal.confirm({
        title,
        content: <Input placeholder={placeholder} onChange={e => { inputTmp = e.target.value }} type={type}/>,
        okText: '确认',
        cancelText: '取消',
        destroyOnClose: true,
        onOk: () => {
            return new Promise((resolve, reject) => {
                if(inputTmp.length > 0) {
                    if(!!todo) todo(inputTmp)
                    resolve()
                } else {
                    message.error('请输入内容!')
                    reject()
                }
            })
        },
        onCancel: () => {

        },
    })
}

//秒数转化为小时分钟秒
export const secondToDate = (result) => {
    const big10 = (num) => {
        if(num < 10) {
            return '0' + num
        }

        return num
    }

    let h = big10(Math.floor(result / 3600)),
        m = big10(Math.floor((result / 60 % 60))),
        s = big10(Math.floor((result % 60)))

    return result = h + ":" + m + ":" + s
}

//获取随机数
export const getRandom = (min, max) =>{
    let r = Math.random() * (max - min),
        re = Math.round(r + min);
    re = Math.max(Math.min(re, max), min)
    return re
}

// 获取当前网卡mac地址
const getCurrNetworkCardMacAddress = () => {
    return new Promise((resolve, reject) => {
        try {
            const interFaces = os.networkInterfaces()
            const cmd = exec(`ipconfig/all`, { encoding: 'buffer' })
            cmd.stderr.on('data', (err) => {
                reject(err)
            })
            cmd.stdout.on('data', (data) => {
                const info = iconv.decode(data, 'cp936')
                const infos = info.split(/\r\n\r\n/)
                const res = infos.map((info, index) => {
                    if (index === 0 || index % 2 === 0) {
                        return null
                    } else {
                        return {
                            name: infos[index - 1],
                            content: info
                        }
                    }
                }).filter(i => i !== null)
                for (let i in interFaces) {
                    interFaces[i].forEach(interFace => {
                        if (interFace.family.toLowerCase() === 'ipv4' && interFace.address !== '127.0.0.1') {
                            const realMac = interFace.mac.split(':').join('-')
                            res.forEach(v => {
                                if (
                                    v.content.match(realMac.toUpperCase())
                                    && v.name.match('以太网')
                                    // && v.content.match(/.*\r\n/)[0].split(':')[1].match(/\S/)
                                ) {
                                    resolve(interFace.mac)
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

// 获取机器码
export const getMachineCode = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const macAddress = await getCurrNetworkCardMacAddress()
            const cpuModel = os.cpus()[0].model
            const md5 = crypto.createHash('md5')
            md5.update(macAddress + cpuModel + 'zyjy8410')
            resolve(md5.digest('hex'))
        } catch (err) {
            ipcRenderer.send('show-message', null, {
                title: '对不起，我们都会有出错的时候',
                message: `请坐和放宽，请把以下信息截图给管理员，问题或许能够得到解决:)\r\n${err.stack}`
            })
            reject(err)
        }
    })
}
