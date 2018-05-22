import './video.less'

import React, { Component } from 'react'
import { Card, Icon, Tag, Col, Row } from 'antd'

const { Meta } = Card

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

export default class videoList extends Component {
    render() {
        const {list} = this.props
        return (
            <Row gutter={16}>
                {
                    list.map(v => (
                        <Col className={'zy-card'} lg={6} xxl={4} key={v.id} style={{ height: '2.7rem' }}>
                            <Card
                                hoverable={true}
                                cover={<img alt={v.title} src={v.coverURL} style={{ height: '1.4rem' }}/>}
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
                    ))
                }
            </Row>
        )
    }
}