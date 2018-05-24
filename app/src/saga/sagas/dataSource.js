import  { put, call } from 'redux-saga/effects'
import { store } from '../../index'
import { cChangePlayType } from '../../redux/reducers/playlist'
import { INITIAL_STATE as dataSourceInitState, cChangeDsLoading, cGetVideo, cGetLive, cGetVideoSuccess, cGetLiveSuccess } from '../../redux/reducers/dataSource'
import { sGetVideoList, sGetLiveList } from '../../service/index'
import { message } from 'antd'

//列表每15分钟刷新一次
const TIMEOUT = 1000 * 60 * 15

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

function getInitParams(key) {
    const params = dataSourceInitState.getIn([key, 'params']).toJS()
    return params
}

function getParams(key) {
    const { dataSource } = store.getState(),
        params = dataSource.getIn([key, 'params']).toJS()
    return params
}

export function* changeKey({ payload }) {
    const params = getInitParams(payload)

    switch (payload) {
        case 'video':
            yield put(cChangePlayType({type: 'video'}))
            yield put(cGetVideo({params}))
            break
        case 'live':
            yield put(cChangePlayType({type: 'video'}))
            yield put(cGetLive({params}))
            break
    }
}

export function* getVideo ({ payload: { active = false, add = false, params = getParams('video') } }) {
    if(!!active || needUpdate()) {
        try {
            if(!add) {
                yield put(cChangeDsLoading(true))
            } else {
                params.page += 1
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
                }
                yield put(cGetVideoSuccess({ params, list, total, isAll}))
            }
        } catch (e) {
            message.error('获取视频列表失败!')
        }
    }
}

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