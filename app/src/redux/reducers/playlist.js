import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const CHANGE_PLAY_TYPE = 'CHANGE_PLAY_TYPE'

export const ADD_PLAY = 'ADD_PLAY'
export const ADD_PLAY_SUCCESS = 'ADD_PLAY_SUCCESS'

export const REMOVE_PLAY = 'REMOVE_PLAY'
export const REMOVE_PLAY_SUCCESS = 'REMOVE_PLAY_SUCCESS'

export const INITIAL_STATE = Immutable.fromJS({
    type: '',
    list: [],
})

export default handleActions({
    [CHANGE_PLAY_TYPE]: (state, {payload}) => (
        state.set('type', payload)
    ),
    [ADD_PLAY_SUCCESS]: (state, {payload}) => (
        state
    ),
    [REMOVE_PLAY_SUCCESS]: (state, {payload}) => (
        state
    )
}, INITIAL_STATE)

export const cChangePlayType = createAction(CHANGE_PLAY_TYPE)
export const cAddPlay = createAction(ADD_PLAY)
export const cRemovePlay = createAction(REMOVE_PLAY)