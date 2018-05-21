import './index.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card } from 'antd'
import { cChangeKey, cGetVideo, cGetLive } from '../../redux/reducers/dataSource'

class PageIndex extends Component {
    componentWillMount() {
        const { dataSource, getVideo, getLive } = this.props,
            activeKey = dataSource.get('activeKey')
        switch (activeKey) {
            case 'video':
                getVideo({active: true})
                break
            case 'live':
                getLive({active: true})
                break
        }
    }

    onTabChange = (key) => {
        this.props.changeKey(key)
    }

    render() {
        const { dataSource } = this.props
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
            video: <p>video content</p>,
            live: <p>list content</p>
        }
        return (
            <Card
                loading={dataSource.get('loading')}
                style={{ height: '100%' }}
                activeTabKey={activeKey}
                tabList={tabList}
                onTabChange={this.onTabChange}
            >
                {contentList[activeKey]}
            </Card>
        )
    }
}

export default connect(
    ({ dataSource }) => ({ dataSource }),
    (dispatch) => bindActionCreators({
        changeKey: cChangeKey,
        getVideo: cGetVideo,
        getLive: cGetLive,
    }, dispatch)
)(PageIndex)