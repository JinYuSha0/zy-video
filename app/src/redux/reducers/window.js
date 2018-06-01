import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const WINDOW_MAX = 'WINDOW_MAX'
export const WINDOW_MIN = 'WINDOW_MIN'
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS'
export const CONNECT_FAILURE = 'CONNECT_FAILURE'
export const NOTICE = 'NOTICE'

export const INITIAL_STATE = Immutable.fromJS({
    isMax: false,
    socketConnect: false,
})

export default handleActions({
    [WINDOW_MAX]: (state) => (
        state.set('isMax', true)
    ),
    [WINDOW_MIN]: (state) => (
        state.set('isMax', false)
    ),
    [CONNECT_SUCCESS]: (state) => (
        state.set('socketConnect', true)
    ),
    [CONNECT_FAILURE]: (state) => (
        state.set('socketConnect', false)
    )
}, INITIAL_STATE)

export const cWindowMax = createAction(WINDOW_MAX)
export const cWindowMin = createAction(WINDOW_MIN)
export const cConnectFailure = createAction(CONNECT_FAILURE)