import './index.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, message, Spin } from 'antd'
import { recursionGetAttr, getInput } from '../../util/util'
import { cGetCurrentUser } from '../../redux/reducers/user'
import { cChangeKey, cGetVideo, cGetLive, cChangeScrollTop } from '../../redux/reducers/dataSource'
import { cAddPlay, cRemovePlay, cSetPlayList, cPlayVideo, cPlayMultipleVideo } from '../../redux/reducers/playlist'
import { sValidatePass } from '../../service/index'

import PageVersion from '../version/version'
import VideoList from '../../components/videoList/video/video'
import LeftBar from '../../components/leftBar/leftBar'

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
            const { attr, elem } = await recursionGetAttr(e.target, ['data-video-id', 'data-video-encrypted']),
                title = elem.children[0].querySelector('.ant-card-meta-title').innerHTML,
                [id, encrypted] = attr,
                { playVideo } = this.props

            if(JSON.parse(encrypted)) {
                getInput('请输入视频密码', '视频密码', 'password', (pass) => {
                    playVideo({ id, title, pass})
                })
            } else {
                playVideo({ id, title })
            }
        } catch (e) {
            message.error(e.message)
        }
    }

    addVideo = async (e) => {
        try {
            const { attr, elem } = await recursionGetAttr(e.target, ['data-video-id', 'data-video-encrypted']),
                title = elem.children[0].querySelector('.ant-card-meta-title').innerHTML,
                hasEncrypt = JSON.parse(attr[1]),
                { addPlay } = this.props
            let item = { id: attr[0], title }
            if(hasEncrypt) {
                getInput('请输入视频密码', '视频密码', 'password', async (pass) => {
                    item.pass = pass
                    const result = await sValidatePass({ videoId: item.id, pass })
                    if(result.status === 'success') {
                        addPlay(item)
                    } else {
                        message.error(result.msg)
                    }
                })
            } else {
                addPlay(item)
            }
        } catch (e) {
            message.error(e.message)
        }
    }

    render() {
        const { dataSource, getVideo, leftBar, changeScrollTop } = this.props,
            tabList = [
            {
                key: 'video',
                tab: '视频'
            }, {
                key: 'live',
                tab: '直播'
            }
        ],
            action = dataSource.get('action'),
            list = dataSource.getIn(['video', 'list']),
            otherList = dataSource.getIn(['other', 'list']),
            contentList = {
                video: <VideoList list={!!action ? otherList : list} dataSource={dataSource} getVideo={getVideo} changeScrollTop={changeScrollTop}/>,
                live: <p>list content</p>
            },
            activeKey = dataSource.get('activeKey')
        return (
            <div className={'page-index'}>
                <Card
                    onClick={this.onClick}
                    loading={dataSource.get('loading')}
                    style={{ height: '100%' }}
                    bodyStyle={{ position: 'absolute', top: 55, bottom: 0, overflow: 'hidden', width: 'calc(100% - ' + leftBar.get('width') + ')', backgroundColor: '#ECECEC', padding: '0', marginLeft: leftBar.get('marginLeft') }}
                    activeTabKey={activeKey}
                    tabList={tabList}
                    onTabChange={this.onTabChange}
                >
                    {contentList[activeKey]}

                    {
                        dataSource.get('addLoading') && (
                            <div className={'loading-container'}>
                                <Spin/>
                            </div>
                        )
                    }
                </Card>

                <LeftBar/>
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
    ({ user, dataSource, leftBar }) => ({ user, dataSource, leftBar }),
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
        changeScrollTop: cChangeScrollTop,
    }, dispatch)
)(PageIndex)