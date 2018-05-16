import { combineReducers  } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './reducers/user'
import window from './reducers/window'

export default combineReducers({
    router: routerReducer,
    user,
    window,
})