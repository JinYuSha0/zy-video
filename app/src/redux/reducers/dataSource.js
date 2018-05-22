import Immutable, { Map, List } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const CHANGE_KEY = 'CHANGE_KEY'
export const CHANGE_DS_LOADING = 'CHANGE_DS_LOADING'

export const GET_VIDEO = 'GET_VIDEO'
export const GET_VIDEO_SUCCESS = 'GET_VIDEO_SUCCESS'

export const GET_LIVE = 'GET_LIVE'
export const GET_LIVE_SUCCESS = 'GET_LIVE_SUCCESS'

export const INITIAL_STATE = Immutable.fromJS({
    loading: false,
    activeKey: 'video',
    video: {
        total: 0,
        list: [],
        timestamp: null,
        params: {
            page: 1,
            size: 12,
            cateId: null,
            title: null,
        }
    },
    live: {
        list: [],
        timestamp: null,
        params: {
            page: 1,
            cateId: null,
            title: null,
        }
    }
})

export default handleActions({
    [CHANGE_KEY]: (state, { payload }) => (
        state.set('activeKey', payload)
    ),
    [CHANGE_DS_LOADING]: (state, {payload}) => (
        state.set('loading', payload)
    ),
    [GET_VIDEO_SUCCESS]: (state, { payload: { params, list, total } }) => (
        state.set('loading', false)
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
}, INITIAL_STATE)

export const cChangeKey = createAction(CHANGE_KEY, key => key)
export const cChangeDsLoading = createAction(CHANGE_DS_LOADING, status => status)
export const cGetVideo = createAction(GET_VIDEO, params => params)
export const cGetVideoSuccess = createAction(GET_VIDEO_SUCCESS)
export const cGetLive = createAction(GET_LIVE, params => params)
export const cGetLiveSuccess = createAction(GET_LIVE_SUCCESS)