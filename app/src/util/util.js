import { store, history } from '../index'

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