import { combineReducers  } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './reducers/user'
import window from './reducers/window'
import dataSource from './reducers/dataSource'
import playlist from './reducers/playlist'
import leftBar from './reducers/leftBar';

export default combineReducers({
    router: routerReducer,
    user,
    window,
    dataSource,
    playlist,
    leftBar,
})