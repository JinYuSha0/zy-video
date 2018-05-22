import Immutable, { Map } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export const LOGOUT = 'LOGOUT'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const GET_CURRENT_USER = 'GET_CURRENT_USER'
export const GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS'

export const OPEN_LOCK = 'OPEN_LOCK'
export const OPEN_LOCK_SUCCESS = 'OPEN_LOCK_SUCCESS'
export const CLOSE_LOCK = 'CLOSE_LOCK'
export const CLOSE_LOCK_SUCCESS = 'CLOSE_LOCK_SUCCESS'

export const INITIAL_STATE = Immutable.fromJS({
    isLogin: false,
    loginId: '',
    token: '',
    userInfo: {
        level: null,
        nickName: null,
        headImg: null
    },
    lock: false,
    lockPass: '',
})

export default handleActions({
    [LOGIN_SUCCESS]: (state, {payload}) => (
        state.merge(payload).set('isLogin', true)
    ),
    [LOGOUT_SUCCESS]: state => INITIAL_STATE,
    [GET_CURRENT_USER_SUCCESS]: (state, {payload}) => (
        state.set('userInfo', Map(payload))
    ),
    [OPEN_LOCK_SUCCESS]: (state, {payload}) => (
        state.set('lock', true).set('lockPass', payload)
    ),
    [CLOSE_LOCK_SUCCESS]: (state) => (
        state.set('lock', false).set('lockPass', '')
    )
}, INITIAL_STATE)

export const cLogin = createAction(LOGIN, data => data)
export const cLoginSuccess = createAction(LOGIN_SUCCESS, data => data)

export const cLogout = createAction(LOGOUT)
export const cLogoutSuccess = createAction(LOGOUT_SUCCESS)

export const cGetCurrentUser = createAction(GET_CURRENT_USER)
export const cGetCurrentUserSuccess = createAction(GET_CURRENT_USER_SUCCESS, data => data)

export const cOpenLock = createAction(OPEN_LOCK)
export const cOpenLockSuccess = createAction(OPEN_LOCK_SUCCESS, data => data)
export const cCloseLock = createAction(CLOSE_LOCK)
export const cCloseLockSuccess = createAction(CLOSE_LOCK_SUCCESS)