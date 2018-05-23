import './video.less'

import React, { Component } from 'react'
import { Card, Icon, Tag, Col, Row } from 'antd'
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
        const { v }= this.props
        return (
            <Col className={'zy-card'} lg={6} xxl={4}>
                <Card
                    hoverable={true}
                    cover={<img alt={v.title} src={v.coverURL} />}
                    actions={[
                        <Icon type="caret-right"/>,
                        <Icon type="plus"/>,
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
        this.onScroll = debounce(this.onScroll, 300)
    }

    cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
        const {list} = this.props,
            v = list.get(columnIndex + rowIndex*4)

        console.log(style)
        return (
            <div style={style}>
                <VideoItem key={v.id}  v={v}/>
            </div>
        )
    }

    onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
        if(scrollHeight - clientHeight - scrollTop < 0) {
            console.log('加载')
            //this.props.getVideo({ active: true, add: true })
        }
    }

    render() {
        const {list} = this.props
        return (
            <Row gutter={16} style={{ width: '100%', height: '100%'}}>
                <AutoSizer>
                    {({ height, width }) => {
                        const { columnCount, rowHeight } = getColumnCountAndRowHeight(width)
                        return (
                            <Grid
                                onScroll={this.onScroll}
                                height={height}
                                width={width}
                                rowHeight={rowHeight}
                                columnWidth={width / columnCount}
                                columnCount={columnCount}
                                rowCount={list.size / columnCount}
                                cellRenderer={this.cellRenderer}
                                style={{ overflowX: 'hidden', overflowY: 'auto'}}
                            />
                        )
                    }}
                </AutoSizer>
            </Row>
        )
    }
}
