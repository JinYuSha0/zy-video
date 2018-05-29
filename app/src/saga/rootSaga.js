import { put, take, takeLatest, takeEvery, all } from 'redux-saga/effects'

import { LOGIN, LOGOUT, GET_CURRENT_USER, OPEN_LOCK, CLOSE_LOCK } from '../redux/reducers/user'
import { login, logout, openLock, closeLock, getCurrentUser } from './sagas/user'

import { WINDOW_MAX, WINDOW_MIN, RESET } from '../redux/reducers/window'
import { windowMax, windowMin, resetStore } from './sagas/window'

import { CHANGE_KEY, GET_VIDEO, GET_LIVE, SEARCH_VIDEO, CLASSIFY_VIDEO } from '../redux/reducers/dataSource'
import { changeKey, getLive, getVideo, searchVideo, classifyVideo } from './sagas/dataSource'

import { PLAY_VIDEO, PLAT_MULTIPLE_VIDEO } from '../redux/reducers/playlist'
import { playVideo, playMultipleVideo } from './sagas/playlist'

export default function* root() {
    yield all([
        takeLatest(LOGIN, login),
        takeLatest(LOGOUT, logout),
        takeLatest(GET_CURRENT_USER, getCurrentUser),
        takeLatest(OPEN_LOCK, openLock),
        takeLatest(CLOSE_LOCK, closeLock),

        takeEvery(WINDOW_MAX, windowMax),
        takeEvery(WINDOW_MIN, windowMin),
        takeEvery(RESET, resetStore),

        takeEvery(CHANGE_KEY, changeKey),
        takeLatest(GET_VIDEO, getVideo),
        takeLatest(GET_LIVE, getLive),
        takeLatest(SEARCH_VIDEO, searchVideo),
        takeLatest(CLASSIFY_VIDEO, classifyVideo),

        takeLatest(PLAY_VIDEO, playVideo),
        takeLatest(PLAT_MULTIPLE_VIDEO, playMultipleVideo),

    ])
}