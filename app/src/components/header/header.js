import './header.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { jump } from '../../util/util'
import { ipcRenderer } from 'electron'
import { LOGIN, login_options } from '../../../extra/login/login'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMax: false
        }
    }

    onMinClick = () => {
        ipcRenderer.send('minimize-window')
    }

    onMaxClick = () => {
        ipcRenderer.send('maximize-window')
        this.setState({ isMax: true })
    }

    onUnMaxClick = () => {
        ipcRenderer.send('unmaximize-window')
        this.setState({ isMax: false })
    }

    onCloseClick = () => {
        ipcRenderer.send('close-all-window')
    }

    onLoginClick = () => {
        const { user } = this.props
        if(!user.get('isLogin')) {
            ipcRenderer.send('open-window', LOGIN, login_options)
        }
    }

    render() {
        const { isMax } = this.state
        const { user } = this.props
        return (
            <header className="layoutHeader">
                <div className="headerLogo" onClick={() => {jump('/')}}>
                    <span className="logo"/>
                    <h2>中宜视频系统</h2>
                </div>

                <div className="headerController">
                    <div className="barWrapper">
                        <div className="user" onClick={this.onLoginClick}>
                            <span className="avatar"></span>
                            <p className="userName">{user.get('isLogin') ? user.getIn(['userInfo', 'nickName']) : '登录'}</p>
                        </div>

                        <span className="icon settings"/>
                    </div>

                    <span className="divider"></span>

                    <div className="controllerWrapper">
                        <span className="icon min" onClick={this.onMinClick}/>

                        {
                            isMax ? <span className="icon unmax" onClick={this.onUnMaxClick}/> :
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
    ({user}) => ({user}),
    (dispatch) => bindActionCreators({
    }, dispatch)
)(Header)
