import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions'

const OPEN = {
    isOpen: true,
    width: '200px',
    marginLeft: 200,
    className: 'open'
}
const CLOSE = {
    isOpen: false,
    width: '64px',
    marginLeft: 64,
    className: 'close'
}

export const OPEN_LEFT_BAR = 'OPEN_LEFT_BAR'
export const CLOSE_LEFT_BAR = 'CLOSE_LEFT_BAR'

export const INITIAL_STATE = Immutable.fromJS(CLOSE)

export default handleActions({
    [OPEN_LEFT_BAR]: (state) => (
        Immutable.fromJS(OPEN)
    ),
    [CLOSE_LEFT_BAR]: (state) => (
        Immutable.fromJS(CLOSE)
    )
}, INITIAL_STATE)

export const cOpenLeftBar = createAction(OPEN_LEFT_BAR)
export const cCloseLeftBar = createAction(CLOSE_LEFT_BAR)

