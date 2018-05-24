import './index.less'

import Immutable, { Map } from 'immutable'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, message } from 'antd'
import { recursionGetAttr } from '../../util/util'
import { cGetCurrentUser } from '../../redux/reducers/user'
import { cChangeKey, cGetVideo, cGetLive } from '../../redux/reducers/dataSource'
import { cAddPlay, cRemovePlay, cSetPlayList, cPlayVideo, cPlayMultipleVideo } from '../../redux/reducers/playlist'

import PageVersion from '../version/version'
import VideoList from '../../components/videoList/video/video'

class Content extends Component {
    constructor(props) {
        super(props)
    }

    onTabChange = (key) => {
        this.props.changeKey(key)
    }

    onClick = (e) => {
        //统一事件代理
        const action = e.target.getAttribute('data-action')
        if(!!action) {
            switch (action) {
                case 'play-video':
                    this.playVideo(e)
                    break
                case 'add-video':
                    this.addVideo(e)
                    break
            }
        }
    }

    playVideo = async (e) => {
        try {
            const { attr } = await recursionGetAttr(e.target, ['data-video-id', 'data-video-encrypted']),
                [id, encrypted] = attr,
                { playVideo } = this.props

            if(JSON.parse(encrypted)) {
                //todo 输入密码
            } else {
                playVideo({ id, pass: null})
            }
        } catch (e) {
            message.error(e.message)
        }
    }

    addVideo = async (e) => {
        try {
            const { attr } = await recursionGetAttr(e.target, ['data-video-id'])
            console.log('添加视频', attr)
        } catch (e) {
            message.error(e.message)
        }
    }

    render() {
        const { dataSource, getVideo } = this.props
        const tabList = [
            {
                key: 'video',
                tab: '视频'
            }, {
                key: 'live',
                tab: '直播'
            }
        ]
        const contentList = {
            video: <VideoList dataSource={dataSource} list={dataSource.getIn(['video', 'list'])} getVideo={getVideo}/>,
            live: <p>list content</p>
        }
        const activeKey = dataSource.get('activeKey')
        return (
            <div className={'page-index'}>
                <Card
                    onClick={this.onClick}
                    loading={dataSource.get('loading')}
                    style={{ height: '100%' }}
                    bodyStyle={{ position: 'absolute', top: 55, bottom: 0, overflow: 'hidden', width: '100%', backgroundColor: '#ECECEC', padding: '0' }}
                    activeTabKey={activeKey}
                    tabList={tabList}
                    onTabChange={this.onTabChange}
                >
                    {contentList[activeKey]}
                </Card>
            </div>
        )
    }
}

class PageIndex extends Component {
    componentWillMount() {
        const { user, getCurrentUser } = this.props,
            isLogin = user.get('isLogin')

        if(isLogin) {
            getCurrentUser()
        }
    }

    render() {
        const { user } = this.props
        return user.get('isLogin') ?
            <Content {...this.props}/>
            :
            <PageVersion/>
    }
}

export default connect(
    ({ user, dataSource }) => ({ user, dataSource }),
    (dispatch) => bindActionCreators({
        changeKey: cChangeKey,
        getVideo: cGetVideo,
        getLive: cGetLive,
        getCurrentUser: cGetCurrentUser,
        addPlay: cAddPlay,
        removePlay: cRemovePlay,
        setPlayList: cSetPlayList,
        playVideo: cPlayVideo,
        playMultipleVideo: cPlayMultipleVideo,
    }, dispatch)
)(PageIndex)