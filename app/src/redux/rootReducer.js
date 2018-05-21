import { combineReducers  } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './reducers/user'
import window from './reducers/window'
import dataSource from './reducers/dataSource'

export default combineReducers({
    router: routerReducer,
    user,
    window,
    dataSource,
})