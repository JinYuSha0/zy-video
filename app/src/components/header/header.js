import './header.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { jump } from '../../util/util'
import { ipcRenderer } from 'electron'
import { LOGIN, login_options } from '../../../extra/login/login'
import { store } from '../../index'
import { cWindowMax, cWindowMin } from '../../redux/reducers/window'

import randomModal from '../randomModal/randomModal'
import UserModal from './userModal/userModal'
import SettingsModal from './settingsModal/settingsModal'

class Header extends Component {
    onMinClick = () => {
        ipcRenderer.send('minimize-window')
    }

    onMaxClick = () => {
        this.props.windowMax()
    }

    onUnMaxClick = () => {
        this.props.windowMin()
    }

    onCloseClick = () => {
        ipcRenderer.send('close-all-window')
    }

    onLoginClick = (e) => {
        const { user } = this.props
        if(!user.get('isLogin')) {
            ipcRenderer.send('open-window', LOGIN, login_options)
        } else {
            new randomModal(<UserModal store={store}/>, e.target, 140, 90)
        }
    }

    onSettingClick = (e) => {
        const { user } = this.props
        if(user.get('isLogin')) {
            new randomModal(<SettingsModal store={store}/>, e.target, 140, 90)
        }
    }

    render() {
        const { user, window } = this.props
        return (
            <header className="layoutHeader">
                <div className="headerLogo" onClick={() => {jump('/')}}>
                    <span className="logo"/>
                    <h2>中宜视频系统</h2>
                </div>

                <div className="headerController">
                    <div className="barWrapper">
                        <div className="user">
                            <span className="avatar"></span>
                            <p className="userName" onClick={this.onLoginClick}>{user.get('isLogin') ? user.getIn(['userInfo', 'nickName']) : '登录'}</p>
                        </div>

                        <span className="icon settings" onClick={this.onSettingClick}/>
                    </div>

                    <span className="divider"></span>

                    <div className="controllerWrapper">
                        <span className="icon min" onClick={this.onMinClick}/>

                        {
                            window.get('isMax') ? <span className="icon unmax" onClick={this.onUnMaxClick}/> :
                                <span className="icon max" onClick={this.onMaxClick}/>
                        }

                        <span className="icon close" onClick={this.onCloseClick}/>
                    </div>
                </div>
            </header>
        )
    }
}

export default connect(
    ({user, window}) => ({user, window}),
    (dispatch) => bindActionCreators({
        windowMax: cWindowMax,
        windowMin: cWindowMin,
    }, dispatch)
)(Header)
