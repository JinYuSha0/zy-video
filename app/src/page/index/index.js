import './index.less'

import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, message, Spin, Divider } from 'antd'
import { recursionGetAttr, getInput } from '../../util/util'
import { cChangeKey, cGetVideo, cGetLive, cChangeScrollTop } from '../../redux/reducers/dataSource'
import { cAddPlay, cRemovePlay, cSetPlayList, cPlayVideo, cPlayLive, cPlayMultipleVideo } from '../../redux/reducers/playlist'
import { sValidatePass, sNeedUpdate } from '../../service/index'

import { version } from '../../../../package'

import VideoList from '../../components/videoList/video/video'
import LiveList from '../../components/videoList/live/live'
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
                case 'play-live':
                    this.playLive(e)
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

    playLive = async (e) => {
        try {
            const { attr, elem } = await recursionGetAttr(e.target, ['data-live-title', 'data-live-encrypted']),
                [title, encrypted] = attr,
                { playLive } = this.props

            if(JSON.parse(encrypted)) {
                getInput('请输入直播密码', '直播密码', 'password', (pass) => {
                    playLive({ title, pass })
                })
            } else {
                playLive({ title })
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
            videoList = dataSource.getIn(['video', 'list']),
            liveList = dataSource.getIn(['live', 'list']),
            otherList = dataSource.getIn(['other', 'list']),
            contentList = {
                video: <VideoList list={!!action ? otherList : videoList} dataSource={dataSource} getVideo={getVideo} changeScrollTop={changeScrollTop}/>,
                live: <LiveList list={liveList}/>
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

class Version extends Component {
    fix = async () => {
        const { UPDATE, update_options } = require('../../../extra/update/update'),
            { status, needUpdate, data } = await sNeedUpdate()

        if(status === 'success') {
            if(needUpdate) {
                window.updateData = Object.assign(data, { oldVersion: '修复', force: false })
                ipcRenderer.send('open-window', UPDATE, update_options)
            }
        } else {
            message.error('获取修复信息失败!')
        }
    }

    render() {
        return (
            <div className={'page-version'}>
                <div className={'footer'}>
                    <p className={'version'}>版本:{version}</p>
                    <Divider style={{top: '4px'}} type="vertical" />
                    <p className={'fix'} onClick={this.fix}>修复</p>
                </div>
            </div>
        )
    }
}

class PageIndex extends Component {
    render() {
        const { user } = this.props
        return user.get('isLogin') ?
            <Content {...this.props}/>
            :
            <Version/>
    }
}

export default connect(
    ({ user, dataSource, leftBar }) => ({ user, dataSource, leftBar }),
    (dispatch) => bindActionCreators({
        changeKey: cChangeKey,
        getVideo: cGetVideo,
        getLive: cGetLive,
        addPlay: cAddPlay,
        removePlay: cRemovePlay,
        setPlayList: cSetPlayList,
        playVideo: cPlayVideo,
        playLive: cPlayLive,
        playMultipleVideo: cPlayMultipleVideo,
        changeScrollTop: cChangeScrollTop,
    }, dispatch)
)(PageIndex)