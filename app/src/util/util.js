import React from 'react'
import { store, history } from '../index'
import { Modal, Input, message } from 'antd'

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
    const { user, router: {location: {pathname}} } = store.getState()
    if(pathname !== path) {
        history.push(path)

        //user.get('lock')
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
export const getInput = (title = '', placeholder = '', todo) => {
    let inputTmp = ''
    Modal.confirm({
        title,
        content: <Input placeholder={placeholder} onChange={e => { inputTmp = e.target.value }}/>,
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
