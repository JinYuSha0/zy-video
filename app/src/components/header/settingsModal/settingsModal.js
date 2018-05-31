import './settingsModal.less'

import React, {Component} from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cOpenLock, cCloseLock, cOpenController, cCloseController, cChangeFeedBackSuccess } from '../../../redux/reducers/user'
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

    onControllerChange = () => {
        const { user, openController, closeController } = this.props,
            isOpenController = user.get('controller')
        if(isOpenController) {
            closeController()
        } else {
            openController()
        }
    }

    onFeedbackChange = () => {
        this.props.changeFeedBack()
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
                    播放控制
                    <Switch size="small" checked={user.get('controller')} onChange={this.onControllerChange}/>
                </div>

                <div className="modalBtn">
                    播放反馈
                    <Switch size="small" checked={user.get('feedback')} onChange={this.onFeedbackChange}/>
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
        openController: cOpenController,
        closeController: cCloseController,
        changeFeedBack: cChangeFeedBackSuccess,
    }, dispatch)
)(SettingsModal)