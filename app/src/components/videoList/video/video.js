import './video.less'

import React, { Component } from 'react'
import { Card, Icon, Tag, Col, Row, message } from 'antd'
import { AutoSizer, Grid } from 'react-virtualized'
import { rem2px } from "../../../util/util"
import debounce from 'lodash.debounce'

const { Meta } = Card

export const getColumnCountAndRowHeight = (width) => {
    if(width < 1600) {
        return {
            columnCount: 4,
            rowHeight: Math.floor(rem2px(2.7))
        }
    } else {
        return {
            columnCount: 6,
            rowHeight: Math.floor(rem2px(2))
        }
    }
}
export const getVideoStatusTag = (status) => {
    switch (status) {
        case 'Normal':
            return <Tag color="green">正常</Tag>
            break
        case 'UploadSucc':
            return <Tag color="orange">上传完成</Tag>
            break
        case 'Uploading':
            return <Tag color="orange">上传中</Tag>
            break
        case 'Transcoding':
            return <Tag color="orange">转码中</Tag>
            break
        case 'TranscodeFail':
            return <Tag color="orange">转码失败</Tag>
            break
        case 'Checking':
            return <Tag color="orange">审核中</Tag>
            break
        case 'Blocked':
            return <Tag color="red">屏蔽</Tag>
            break
    }
}

class VideoItem extends Component {
    render() {
        const { v, style }= this.props
        return (
            <Col data-video-id={v.id} data-video-encrypted={!!v.hasPass} className={'zy-card'} style={style} lg={6} xxl={4}>
                <Card
                    hoverable={true}
                    cover={<img alt={v.title} src={v.coverURL} />}
                    actions={[
                        <Icon data-action={'play-video'} type="caret-right"/>,
                        <Icon data-action={'add-video'} type="plus"/>,
                        v.hasPass ? <Icon type="lock" /> : <Icon type="unlock" />
                    ]}
                >
                    <Meta
                        title={v.title}
                        description={
                            <div className={'item-description'}>
                                {getVideoStatusTag(v.status)}
                                <Tag color={'blue'}>{v.cateName}</Tag>
                                <Tag color={'cyan'}>{v.size}</Tag>
                            </div>
                        }
                    />
                </Card>
            </Col>
        )
    }
}

export default class videoList extends Component {
    constructor(props) {
        super(props)
        this.onScroll = debounce(this.onScroll, 200)
        this.columnCount = 4
    }

    cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
        const {list} = this.props,
            v = list.get(columnIndex + rowIndex*this.columnCount)
        return !!v ? <VideoItem key={v.id} style={style} v={v}/> : null
    }

    onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
        const { dataSource, changeScrollTop } = this.props,
            action = dataSource.get('action'),
            _scrollTop = !!action ? 0 : dataSource.getIn([dataSource.get('activeKey'), 'scrollTop']),
            isDown = scrollTop - _scrollTop > 0,
            isLoad = scrollHeight - clientHeight - scrollTop <= 100

        if(isDown && isLoad) {
            //fix 全部加载后向上滑动也会触发
            const { list, dataSource } = this.props,
                action = dataSource.get('action'),
                size = list.size,
                total = !!action ? dataSource.getIn(['other', 'total']) : dataSource.getIn(['video', 'total'])

            if(total === null || total === 0) {
                return
            }

            if(total !== null && total === size) {
                message.destroy()
                message.info('已无更多视频')
                return
            }

            this.props.getVideo({ active: true, add: true })
        }

        if(!action) {
            changeScrollTop(scrollTop)
        }
    }

    render() {
        const { list, dataSource } = this.props,
            action = dataSource.get('action'),
            scrollTop = dataSource.getIn([dataSource.get('activeKey'), 'scrollTop'])

        return (
            <Row gutter={16} style={{ width: '100%', height: '100%' }}>
                <AutoSizer ref={container => this.container = container}>
                    {({ height, width }) => {
                        const { columnCount, rowHeight } = getColumnCountAndRowHeight(width)
                        this.columnCount = columnCount
                        return (
                            <Grid
                                onScroll={this.onScroll}
                                scrollTop={!!action ? null : scrollTop}
                                height={height}
                                width={width}
                                rowHeight={rowHeight}
                                columnWidth={(width - 12) / columnCount}
                                columnCount={columnCount}
                                rowCount={Math.ceil(list.size / columnCount)}
                                cellRenderer={this.cellRenderer}
                                style={{ overflowX: 'hidden', overflowY: 'auto', padding: '8px 0' }}
                                //宽度减少12px 留给滑动条
                                containerStyle={{ width: width - 12 }}
                            />
                        )
                    }}
                </AutoSizer>
            </Row>
        )
    }
}
