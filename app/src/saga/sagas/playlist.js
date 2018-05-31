import  { put, call } from 'redux-saga/effects'
import { store, history } from '../../index'
import { jump } from '../../util/util'
import { cPlayVideoSuccess, cPlayMultipleVideoSuccess, cPlayNextVideoSuccess, cPlayLiveSuccess } from '../../redux/reducers/playlist'
import { sGetVideoUrl } from '../../service/index'
import { message } from 'antd'

export function* playVideo({ payload: { id, title, pass } }) {
    try {
        const result = yield call(sGetVideoUrl, {id, pass, type: 2})
        if(result.status === 'success') {
            yield put(cPlayVideoSuccess({ url: result.url, title }))
            if(!!pass) {
                history.push('/player')
            } else {
                jump('/player')
            }
        } else {
            throw new Error()
        }
    } catch (e) {
        console.log(e)
        message.error('获取视频链接失败!')
    }
}

export function* playMultipleVideo() {
    try {
        const { playlist } = store.getState(),
            l0 = playlist.get('list').get(0),
            { id, title, pass } = l0,
            result = yield call(sGetVideoUrl, {id, pass, type: 2})

        if(result.status === 'success') {
            yield put(cPlayMultipleVideoSuccess({ url: result.url, title }))
            jump('/player')
        } else {
            throw new Error()
        }
    } catch (e) {
        console.log(e)
        message.error('获取视频链接失败!')
    }
}

export function* playNextVideo() {
    try {
        const { playlist } = store.getState(),
            index = playlist.get('index'),
            nextVideo = playlist.get('list').get(index+1),
            { id, title, pass } = nextVideo,
            result = yield call(sGetVideoUrl, {id, pass, type: 2})

        if(result.status === 'success') {
            yield put(cPlayNextVideoSuccess({ url: result.url, title }))
        } else {
            throw new Error()
        }
    } catch (e) {
        message.error('获取下一个视频链接失败!')
    }
}

export function* playLive({ payload: { title, pass } }) {
    try {
        const result = yield call(sGetVideoUrl, {title, pass, type: 3})
        if(result.status === 'success') {
            yield put(cPlayLiveSuccess({ url: result.url, title }))
            if(!!pass) {
                history.push('/player')
            } else {
                jump('/player')
            }
        } else {
            throw new Error()
        }
    } catch (e) {
        console.log(e)
        message.error('获取直播链接失败!')
    }
}