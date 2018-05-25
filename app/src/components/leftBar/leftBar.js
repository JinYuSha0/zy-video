import './leftBar.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cOpenLeftBar, cCloseLeftBar } from "../../redux/reducers/leftBar"
import { Icon, Badge } from 'antd'

class LeftBar extends Component {
    onClick =() => {
        const { leftBar, open, close } = this.props
        if(leftBar.get('isOpen')) {
            close()
        } else {
            open()
        }
    }

    render() {
        const { leftBar, playlist } = this.props,
            isOpen = leftBar.get('isOpen')

        return (
            <div className={'side-bar-wrapper'}>
                <div className={leftBar.get('className')}>
                    <div className={'side-bar'}>

                        {
                            isOpen ?
                                <div></div>
                                :
                                <ul className={'side-bar-small'}>
                                    <li className={'small-item'}>
                                        <Icon type="search" style={{ fontSize: 18 }}/>
                                        <span>搜索</span>
                                    </li>

                                    <li className={'small-item'}>
                                        <Icon type="switcher" style={{ fontSize: 18 }}/>
                                        <span>分类</span>
                                    </li>

                                    <li className={'small-item'}>
                                        <Badge count={playlist.get('list').size}>
                                            <Icon type="profile" style={{ fontSize: 18 }}/>
                                        </Badge>
                                        <span>列表</span>
                                    </li>

                                    <li className={'small-item'}>
                                        <Icon type="reload" style={{ fontSize: 18 }}/>
                                        <span>刷新</span>
                                    </li>
                                </ul>
                        }

                    </div>

                    <a className={'bar-btn'} onClick={this.onClick}></a>
                </div>
            </div>
        )
    }
}

export default connect(
    ({ leftBar, playlist }) => ({ leftBar, playlist }),
    (dispatch) => bindActionCreators({
        open: cOpenLeftBar,
        close: cCloseLeftBar,
    }, dispatch)
)(LeftBar)