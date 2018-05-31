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
export const PLAY_NEXT_VIDEO = 'PLAY_NEXT_VIDEO'
export const PLAY_NEXT_VIDEO_SUCCESS = 'PLAY_NEXT_VIDEO_SUCCESS'

export const PLAY_LIVE = 'PLAY_LIVE'
export const PLAY_LIVE_SUCCESS = 'PLAY_LIVE_SUCCESS'

export const UPDATE_CURRENT_TIME = 'UPDATE_CURRENT_TIME'

export const INITIAL_STATE = Immutable.fromJS({
    title: null,        //当前播放视屏标题
    url: null,          //当前播放视频url
    type: '',           //播放类型 video live
    multiple: false,    //是否播放列表
    index: 0,           //播放视频个数
    list: [],           //播放列表
    currentTime: 0,     //当前播放时间
    duration: 0,        //当前视频总长度
})

//单个视频数据
/*const item = {
    id: '',
    title: '',
    pass: '',
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
    [PLAY_VIDEO_SUCCESS]: (state, { payload: { url, title } }) => (
        state.set('url', url).set('title', title).set('type', 'video').set('multiple', false).set('currentTime', 0).set('duration', 0)
    ),
    [PLAY_LIVE_SUCCESS]: (state, { payload: { url, title } }) => (
        state.set('url', url).set('title', title).set('type', 'live').set('multiple', false).set('currentTime', 0).set('duration', 0)
    ),
    [PLAT_MULTIPLE_VIDEO_SUCCESS]: (state, { payload: { url, title }}) => (
        state.set('url', url).set('title', title).set('type', 'video').set('multiple', true).set('index', 0).set('currentTime', 0).set('duration', 0)
    ),
    [PLAY_NEXT_VIDEO_SUCCESS]: (state, { payload: { url, title } }) => (
        state.set('url', url).set('title', title).set('type', 'video').set('multiple', true).set('index', state.get('index')+1).set('currentTime', 0).set('duration', 0)
    ),
    [UPDATE_CURRENT_TIME]: (state, { payload: { currentTime, duration } }) => (
        state.set('currentTime', currentTime).set('duration', duration)
    )
}, INITIAL_STATE)

export const cChangePlayType = createAction(CHANGE_PLAY_TYPE, type => type)
export const cAddPlay = createAction(ADD_PLAY, item => item)
export const cRemovePlay = createAction(REMOVE_PLAY, id => id)
export const cSetPlayList = createAction(SET_PLAY_LIST, list => list)
export const cPlayVideo = createAction(PLAY_VIDEO, id => id)
export const cPlayLive = createAction(PLAY_LIVE, title => title)
export const cPlayLiveSuccess = createAction(PLAY_LIVE_SUCCESS, data => data)
export const cPlayVideoSuccess = createAction(PLAY_VIDEO_SUCCESS, data => data)
export const cPlayMultipleVideo = createAction(PLAT_MULTIPLE_VIDEO)
export const cPlayMultipleVideoSuccess = createAction(PLAT_MULTIPLE_VIDEO_SUCCESS, url => url)
export const cPlayNextVideo = createAction(PLAY_NEXT_VIDEO)
export const cPlayNextVideoSuccess = createAction(PLAY_NEXT_VIDEO_SUCCESS, data => data)
export const cUpdateCurrentTime = createAction(UPDATE_CURRENT_TIME, data => data)
