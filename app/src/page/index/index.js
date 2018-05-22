import './index.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card } from 'antd'
import { cGetCurrentUser } from '../../redux/reducers/user'
import { cChangeKey, cGetVideo, cGetLive } from '../../redux/reducers/dataSource'
import debounce from 'lodash.debounce'

import VideoList from '../../components/videoList/video/video'

class PageIndex extends Component {
    constructor(props) {
        super(props)
        this.onScroll = debounce(this.onScroll, 300)
    }

    componentWillMount() {
        const { user, dataSource, getVideo, getLive, getCurrentUser } = this.props,
            activeKey = dataSource.get('activeKey'),
            isLogin = user.get('isLogin')

        if(isLogin) {
            getCurrentUser()
            /*switch (activeKey) {
                case 'video':
                    getVideo({active: true)
                    break
                case 'live':
                    getLive({active: true})
                    break
            }*/
        }
    }

    componentDidMount() {
        this.antCardBody = this.card.container.children[1]
        this.antCardBody.addEventListener('scroll', this.onScroll)
    }

    componentWillUnmount() {
        this.antCardBody.removeEventListener('scroll', this.onScroll)
    }

    onTabChange = (key) => {
        this.props.changeKey(key)
    }

    onScroll = (e) => {
        const { getVideo } = this.props
        const { clientHeight, scrollHeight, scrollTop } = this.antCardBody
        if(scrollHeight - clientHeight - scrollTop <= 100) {
            getVideo({ active: true, add: true })
        }
    }

    render() {
        const { user, dataSource } = this.props
        const activeKey = dataSource.get('activeKey')
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
            video: <VideoList list={dataSource.getIn(['video', 'list'])}/>,
            live: <p>list content</p>
        }
        return <Card
            ref={card => this.card = card}
            loading={dataSource.get('loading')}
            style={{ height: '100%' }}
            bodyStyle={{ position: 'absolute', top: 55, bottom: 0, overflowY: 'scroll', overflowX: 'hidden', width: '100%', backgroundColor: '#ECECEC' }}
            activeTabKey={activeKey}
            tabList={tabList}
            onTabChange={this.onTabChange}
        >
            {contentList[activeKey]}
        </Card>
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