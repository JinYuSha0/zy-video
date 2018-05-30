import './userModal.less'

import React, {Component} from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cLogout } from '../../../redux/reducers/user'

class UserModal extends Component {
    render() {
        const { logout } = this.props
        return(
            <div className="userModal">
                <div className="modalBtn enter" onClick={logout}>退出登陆</div>
            </div>
        )
    }
}

export default connect(
    ({user}) => ({user}),
    (dispatch) => bindActionCreators({
        logout: cLogout
    }, dispatch)
)(UserModal)