import { URL } from '../config/constant'
import { store } from '../index'
import { fetchGet, fetchPost, delay } from '../util/util'

function getHeaders() {
    const { user } = store.getState()
    return {
        'X-LoginId': user.get('loginId'),
        'X-Authorization': user.get('token'),
    }
}

export async function sLogin(params) {
    const result = await fetchPost(URL + 'adminLoginClient', params)
    return result.data
}

export async function sGetCurrentUser() {
    const result = await fetchPost(URL + 'currentUser', null, getHeaders())
    return result.data
}

export async function sGetVideo(params) {
    const result = await fetchPost(URL + 'findVideoList', params, getHeaders())
    return result.data
}

export async function sGetLive(params) {
    const result = await fetchPost(URL + 'findLiveList', params, getHeaders())
    return result.data
}