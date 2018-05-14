import { put, take, takeLatest, takeEvery, all } from 'redux-saga/effects'

import { LOGIN, LOGOUT, OPEN_LOCK, CLOSE_LOCK } from '../redux/reducers/user'
import { login, logout, openLock, closeLock } from './sagas/user'

export default function* root() {
    yield all([
        takeLatest(LOGIN, login),
        takeLatest(LOGOUT, logout),
        takeLatest(OPEN_LOCK, openLock),
        takeLatest(CLOSE_LOCK, closeLock),
    ])
}