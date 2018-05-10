import { URL } from '../config/constant'
import { store } from '../index'
import { fetchGet, fetchPost } from '../util/util'

export async function login(params) {
    const result = await fetchPost(URL, params)
    return result
}