import './index.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card } from 'antd'
import { cGetCurrentUser } from '../../redux/reducers/user'
import { cChangeKey, cGetVideo, cGetLive } from '../../redux/reducers/dataSource'

import PageVersion from '../version/version'
import VideoList from '../../components/videoList/video/video'

class Content extends Component {
    constructor(props) {
        super(props)
    }

    onTabChange = (key) => {
        this.props.changeKey(key)
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
            video: <VideoList list={dataSource.getIn(['video', 'list'])} getVideo={getVideo}/>,
            live: <p>list content</p>
        }
        const activeKey = dataSource.get('activeKey')
        return (
            <Card
                loading={dataSource.get('loading')}
                style={{ height: '100%' }}
                bodyStyle={{ position: 'absolute', top: 55, bottom: 0, overflow: 'hidden', width: '100%', backgroundColor: '#ECECEC' }}
                activeTabKey={activeKey}
                tabList={tabList}
                onTabChange={this.onTabChange}
            >
                {contentList[activeKey]}
            </Card>
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
        const { user, dataSource, getVideo, changeKey } = this.props
        return user.get('isLogin') ?
            <Content
                user={user}
                dataSource={dataSource}
                getVideo={getVideo}
                changeKey={changeKey}
            />
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
    }, dispatch)
)(PageIndex)