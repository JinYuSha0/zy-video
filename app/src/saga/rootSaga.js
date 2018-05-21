import { put, take, takeLatest, takeEvery, all } from 'redux-saga/effects'

import { LOGIN, LOGOUT, OPEN_LOCK, CLOSE_LOCK } from '../redux/reducers/user'
import { login, logout, openLock, closeLock } from './sagas/user'

import { WINDOW_MAX, WINDOW_MIN } from '../redux/reducers/window'
import { windowMax, windowMin } from './sagas/window'

import { CHANGE_KEY, GET_VIDEO, GET_LIVE } from '../redux/reducers/dataSource'
import { changeKey, getLive, getVideo } from './sagas/dataSource'

export default function* root() {
    yield all([
        takeLatest(LOGIN, login),
        takeLatest(LOGOUT, logout),
        takeLatest(OPEN_LOCK, openLock),
        takeLatest(CLOSE_LOCK, closeLock),

        takeEvery(WINDOW_MAX, windowMax),
        takeEvery(WINDOW_MIN, windowMin),

        takeEvery(CHANGE_KEY, changeKey),
        takeLatest(GET_VIDEO, getVideo),
        takeLatest(GET_LIVE, getLive),
    ])
}