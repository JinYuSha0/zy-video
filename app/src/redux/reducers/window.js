import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const WINDOW_MAX = 'WINDOW_MAX'
export const WINDOW_MIN = 'WINDOW_MIN'
export const RESET = 'RESET'

export const INITIAL_STATE = Immutable.fromJS({
    isMax: false
})

export default handleActions({
    [WINDOW_MAX]: (state) => (
        state.set('isMax', true)
    ),
    [WINDOW_MIN]: (state) => (
        state.set('isMax', false)
    )
}, INITIAL_STATE)

export const cWindowMax = createAction(WINDOW_MAX)
export const cWindowMin = createAction(WINDOW_MIN)
export const cResetStore = createAction('RESET')