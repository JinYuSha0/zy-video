import './settingsModal.less'

import React, {Component} from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cOpenLock, cCloseLock } from '../../../redux/reducers/user'
import { Switch } from 'antd'

class SettingsModal extends Component {
    componentDidMount() {
        this.lock.addEventListener('click', (e) => {
            e.stopPropagation()
            if(e.target.className !== 'modalBtn') {
                this.onLockChange()
            }
        }, false)
    }

    onLockChange = () => {
        const { user, openLock, closeLock } = this.props
        const isLock = user.get('lock')
        if(!isLock) {
            openLock()
        } else {
            closeLock()
        }
    }

    render() {
        const { user } = this.props
        return(
            <div className="settingsModal">
                <div className="modalBtn" ref={lock => this.lock = lock}>
                    操作锁
                    <Switch size="small" checked={user.get('lock')} onChange={this.onLockChange}/>
                </div>

                <div className="modalBtn">
                    播放反馈
                    <Switch size="small"/>
                </div>
            </div>
        )
    }
}

export default connect(
    ({user}) => ({user}),
    (dispatch) => bindActionCreators({
        openLock: cOpenLock,
        closeLock: cCloseLock,
    }, dispatch)
)(SettingsModal)