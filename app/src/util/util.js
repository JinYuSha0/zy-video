import { store, history } from '../index'

//延时
const delay = (ms, todo, err) => {
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
export const fetchGet = (url, params, time) => {
    const netPromise = new Promise((resolve, reject)=> {
        fetch(url + objToUrlParams(params), {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
    const timeoutPromise = delay(time ? time : 5000, null, new Error('请求超时'))
    return Promise.race([netPromise, timeoutPromise])
}

//POST
export const fetchPost = (url, params, time) => {
    const netPromise = new Promise((resolve, reject)=> {
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
    const timeoutPromise = delay(time ? time : 5000, null, new Error('请求超时'))
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
