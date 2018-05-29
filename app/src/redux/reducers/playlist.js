import Immutable, { Map, List } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const CHANGE_PLAY_TYPE = 'CHANGE_PLAY_TYPE'

export const ADD_PLAY = 'ADD_PLAY'
export const REMOVE_PLAY = 'REMOVE_PLAY'
export const SET_PLAY_LIST = 'SET_PLAY_LIST'

export const PLAY_VIDEO = 'PLAY_VIDEO'
export const PLAY_VIDEO_SUCCESS = 'PLAY_VIDEO_SUCCESS'
export const PLAT_MULTIPLE_VIDEO = 'PLAT_MULTIPLE_VIDEO'
export const PLAT_MULTIPLE_VIDEO_SUCCESS = 'PLAT_MULTIPLE_VIDEO_SUCCESS'

export const INITIAL_STATE = Immutable.fromJS({
    url: null,          //当前播放视频url
    type: '',           //播放类型 video live
    multiple: false,    //是否播放列表
    list: [],           //播放列表
})

//单个视频数据
/*const item = {
    id: '',
    title: '',
    pass: ''
}*/

export default handleActions({
    [CHANGE_PLAY_TYPE]: (state, {payload}) => (
        state.set('type', !!payload.type ? payload.type : state.get('type'))
            .set('multiple', !!payload.multiple ? payload.multiple : state.get('multiple'))
    ),
    [ADD_PLAY]: (state, {payload}) => (
        state.set('list', state.get('list').push(payload))
    ),
    [REMOVE_PLAY]: (state, {payload}) => (
        state.set('list', state.get('list').filter((i, k) => k !== payload))
    ),
    [SET_PLAY_LIST]: (state, {payload}) => (
        state.set('list', List(payload))
    ),
    [PLAY_VIDEO_SUCCESS]: (state, {payload}) => (
        state.set('url', payload).set('type', 'video').set('multiple', false)
    ),
    [PLAT_MULTIPLE_VIDEO_SUCCESS]: (state, {payload}) => (
        state.set('url', payload).set('type', 'video').set('multiple', true)
    )
}, INITIAL_STATE)

export const cChangePlayType = createAction(CHANGE_PLAY_TYPE, type => type)
export const cAddPlay = createAction(ADD_PLAY, item => item)
export const cRemovePlay = createAction(REMOVE_PLAY, id => id)
export const cSetPlayList = createAction(SET_PLAY_LIST, list => list)
export const cPlayVideo = createAction(PLAY_VIDEO, id => id)
export const cPlayVideoSuccess = createAction(PLAY_VIDEO_SUCCESS, url => url)
export const cPlayMultipleVideo = createAction(PLAT_MULTIPLE_VIDEO)
export const cPlayMultipleVideoSuccess = createAction(PLAT_MULTIPLE_VIDEO_SUCCESS, url => url)