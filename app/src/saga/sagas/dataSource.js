import  { put, call } from 'redux-saga/effects'
import { store } from '../../index'
import { cChangePlayType } from '../../redux/reducers/playlist'
import { INITIAL_STATE as dataSourceInitState, cChangeDsLoading, cGetVideo, cGetLive, cGetVideoSuccess, cGetLiveSuccess, cChangeDsAddLoading } from '../../redux/reducers/dataSource'
import { sGetVideoList, sGetLiveList } from '../../service/index'
import { message } from 'antd'

//列表每15分钟刷新一次
const TIMEOUT = 1000 * 60 * 15

/***
 * 是否需要更新数据
 * @returns {boolean}
 */
function needUpdate() {
    const { user, dataSource } = store.getState(),
        timestamp = dataSource.getIn(['video', 'timestamp']),
        now = new Date().getTime()

    if((!timestamp || now - timestamp > TIMEOUT) && user.get('isLogin')) {
        return true
    } else {
        return false
    }
}

/***
 * 获取初始化参数
 * @param key
 * @returns {*}
 */
function getInitParams(key) {
    const params = dataSourceInitState.getIn([key, 'params']).toJS()
    return params
}

/***
 * 获取参数
 * @param key
 * @returns {*}
 */
function getParams(key) {
    const { dataSource } = store.getState(),
        params = dataSource.getIn([key, 'params']).toJS()
    return params
}

/***
 * 切换列表
 * @param payload
 */
export function* changeKey({ payload }) {
    const params = getInitParams(payload)
    switch (payload) {
        case 'video':
            yield put(cGetVideo({params}))
            break
        case 'live':
            yield put(cGetLive({params}))
            break
    }
}

/***
 * 获取视频列表
 * @param active 主动刷新
 * @param add    页数增加
 * @param params 请求参数
 */
export function* getVideo ({ payload: { active = false, add = false, params = getParams('video') } }) {
    if(!!active || needUpdate()) {
        try {
            if(add === true) {
                yield put(cChangeDsAddLoading(true))
                params.page += 1
            } else if (active === true) {
                yield put(cChangeDsLoading(true))
                params = getInitParams('video')
            }

            const result = yield call(sGetVideoList, {...params})
            if(result.status === 'success') {
                let { list, total } = result,
                    isAll= false

                if(add) {
                    const { dataSource } = store.getState(),
                        size = dataSource.getIn(['video', 'params', 'size'])

                    isAll = list.length < size
                    list = dataSource.getIn(['video', 'list']).concat(list)
                    yield put(cChangeDsAddLoading(false))
                }
                yield put(cGetVideoSuccess({ params, list, total, isAll}))
            }
        } catch (e) {
            message.error('获取视频列表失败!')
        }
    }
}

/***
 * 获取直播列表
 * @param active
 * @param params
 */
export function* getLive({ payload: { active = false, params = getParams('live') } }) {
    if(!!active || needUpdate()) {
        try {
            yield put(cChangeDsLoading(true))
            const result = yield call(sGetLiveList, {...params})
            if(result.status === 'success') {
                const { list } = result
                yield put(cGetLiveSuccess({ params, list }))
            }
        } catch (e) {
            message.error('获取直播列表失败!')
        }
    }
}