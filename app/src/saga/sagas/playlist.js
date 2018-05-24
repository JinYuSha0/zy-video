import  { put, call } from 'redux-saga/effects'
import { store } from '../../index'
import { jump } from '../../util/util'
import { cPlayVideoSuccess } from '../../redux/reducers/playlist'
import { sGetVideoUrl } from '../../service/index'
import { message } from 'antd'

export function* playVideo({ payload: { id, pass } }) {
    try {
        const result = yield call(sGetVideoUrl, {id, pass, type: 2, title: '测试'})
        if(result.status === 'success') {
            yield put(cPlayVideoSuccess(result.url))
            jump('/player')
        } else {
            throw new Error()
        }
    } catch (e) {
        message.error('获取视频链接失败!')
    }
}

export function* playMultipleVideo() {

}