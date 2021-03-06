import { URL } from '../config/constant'
import { store } from '../index'
import { fetchGet, fetchPost, delay } from '../util/util'
import info from '../../package'
import { getMachineCode } from '../util/util'

/***
 * 获取所需请求头
 */
function getHeaders() {
    const { user } = store.getState()
    return {
        'X-LoginId': user.get('loginId'),
        'X-Authorization': user.get('token'),
    }
}

/***
 * 客户端登录
 * @param params
 * phone    账户
 * password 账户密码
 */
export async function sLogin(params) {
    const result = await fetchPost(URL + 'adminLoginClient', { ...params, v: info.version })
    return result.data
}

/***
 * 获取当前登陆账户信息
 */
export async function sGetCurrentUser() {
    const result = await fetchPost(URL + 'currentUser', null, getHeaders())
    return result.data
}

/***
 * 获取视频列表
 * @param params
 * page    分页页数
 * cateId  分类id
 * title   模糊查询标题
 */
export async function sGetVideoList(params) {
    const result = await fetchPost(URL + 'findVideoList', params, getHeaders())
    return result.data
}

/**
 * 获取直播列表
 */
export async function sGetLiveList() {
    const result = await fetchPost(URL + 'findLiveList', null, getHeaders())
    return result.data
}

/***
 * 获取视频地址
 * @param params
 * id   视频id
 * pass 视频密码
 */
export async function sGetVideoUrl(params) {
    const machineCode = await getMachineCode()
    const result = await fetchPost(URL + 'getPullUrl', { ...params, 'machine_code': machineCode }, getHeaders())
    return result.data
}

/***
 * 获取所有分类
 */
export async function sGetAllClassify() {
    const result = await fetchGet(URL + 'findAllClassify')
    return result.data
}

/***
 * 验证视频密码
 * @param {videoId, pass}
 * @returns {Promise<void>}
 */
export async function sValidatePass(params) {
    const result = await fetchPost(URL + 'validateKey', params, getHeaders())
    return result.data
}

/**
 * 发送钉钉信息通知
 * @param params remark(string)
 * @returns {Promise<void>}
 */
export async function sSendDingText(params) {
    const { user } = store.getState(),
        isOpenFeedBack = user.get('feedback')
    if(!isOpenFeedBack) return
    const result = await fetchPost(URL + 'sendDingText', params, getHeaders())
    return result.data
}

/***
 * 验证是否需要更新
 * @param params version
 * @returns {Promise.<void>}
 */
export async function sNeedUpdate(params) {
    const result = await fetchPost(URL + 'isUpdate', params)
    return result.data
}