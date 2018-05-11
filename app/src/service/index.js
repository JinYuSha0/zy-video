import { URL } from '../config/constant'
import { store } from '../index'
import { fetchGet, fetchPost } from '../util/util'

export async function sLogin(params) {
    const result = await fetchPost(URL + 'adminLoginClient', params)
    const { data } = result
    return data
}