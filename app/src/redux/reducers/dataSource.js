import Immutable, { Map, List } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const CHANGE_KEY = 'CHANGE_KEY'
export const CHANGE_DS_LOADING = 'CHANGE_DS_LOADING'
export const CHANGE_DS_ADD_LOADING = 'CHANGE_DS_ADD_LOADING'

export const GET_VIDEO = 'GET_VIDEO'
export const GET_VIDEO_SUCCESS = 'GET_VIDEO_SUCCESS'

export const SEARCH_VIDEO = 'SEARCH_VIDEO'
export const CLASSIFY_VIDEO = 'CLASSIFY_VIDEO'
export const GET_OTHER_LIST_SUCCESS = 'GET_OTHER_LIST_SUCCESS'
export const CLEAR_OTHER = 'CLEAR_OTHER'

export const GET_LIVE = 'GET_LIVE'
export const GET_LIVE_SUCCESS = 'GET_LIVE_SUCCESS'

export const CHANGE_SCROLL_TOP = 'CHANGE_SCROLL_TOP'

export const INITIAL_STATE = Immutable.fromJS({
    loading: false,
    addLoading: false,
    activeKey: 'video',
    action: null,  //search 搜索页面  classify分类页
    video: {
        total: null,
        timestamp: null,
        scrollTop: 0,
        params: {
            page: 1,
            size: 24
        },
        list: [],
    },
    live: {
        list: [],
        timestamp: null,
        scrollTop: 0,
        params: {
            page: 1,
        }
    },
    other: {
        total: null,
        params: {
            page: 1,
            size: 24,
            cateId: 0,
            title: null,
        },
        list: []
    }
})

export default handleActions({
    [CHANGE_KEY]: (state, { payload }) => (
        state.set('activeKey', payload)
    ),
    [CHANGE_DS_LOADING]: (state, {payload}) => (
        state.set('loading', payload)
    ),
    [CHANGE_DS_ADD_LOADING]: (state, {payload}) => (
        state.set('addLoading', payload)
    ),
    [GET_VIDEO_SUCCESS]: (state, { payload: { params, list, total  } }) => (
        state.set('action', null)
            .set('loading', false)
            .setIn(['video', 'params'], state.getIn(['video','params']).merge(params))
            .setIn(['video', 'list'], List(list))
            .setIn(['video', 'total'], total)
            .setIn(['video', 'timestamp'], new Date().getTime())
    ),
    [GET_LIVE_SUCCESS]: (state, { payload: { params, list } }) => (
        state.set('loading', false)
            .setIn(['live', 'params'], state.getIn(['live','params']).merge(params))
            .setIn(['live', 'list'], List(list))
            .setIn(['live', 'timestamp'], new Date().getTime())
    ),
    [SEARCH_VIDEO]: (state, { payload }) => (
        state.set('loading', true)
            .set('action', 'search')
            .setIn(['other', 'params', 'title'], payload)
    ),
    [CLASSIFY_VIDEO]: (state, { payload }) => (
        state.set('loading', true)
            .set('action', 'classify')
            .setIn(['other', 'params', 'cateId'], payload)
    ),
    [GET_OTHER_LIST_SUCCESS]: (state, { payload: { params, list, total } }) => (
        state.set('loading', false)
            .setIn(['other', 'params'], state.getIn(['other', 'params']).merge(Map(params)))
            .setIn(['other', 'total'], total)
            .setIn(['other', 'list'], List(list))
    ),
    [CLEAR_OTHER]: (state) => (
        state.set('action', null)
            .set('other', INITIAL_STATE.get('other'))
    ),
    [CHANGE_SCROLL_TOP]: (state, { payload }) => (
        state.setIn([state.get('activeKey'), 'scrollTop'], payload)
    )
}, INITIAL_STATE)

export const cChangeKey = createAction(CHANGE_KEY, key => key)
export const cChangeDsLoading = createAction(CHANGE_DS_LOADING, status => status)
export const cChangeDsAddLoading = createAction(CHANGE_DS_ADD_LOADING, status => status)
export const cGetVideo = createAction(GET_VIDEO, params => params)
export const cGetVideoSuccess = createAction(GET_VIDEO_SUCCESS, data => data)
export const cGetLive = createAction(GET_LIVE, params => params)
export const cGetLiveSuccess = createAction(GET_LIVE_SUCCESS)
export const cSearchVideo = createAction(SEARCH_VIDEO, title => title)
export const cClassifyVideo = createAction(CLASSIFY_VIDEO, cateId => cateId)
export const cClearOther = createAction(CLEAR_OTHER)
export const cGetOtherListSuccess = createAction(GET_OTHER_LIST_SUCCESS, data => data)
export const cChangeScrollTop = createAction(CHANGE_SCROLL_TOP, scrollTop => scrollTop)