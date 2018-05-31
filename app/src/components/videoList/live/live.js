import React, { Component } from 'react'
import { Card, Col, Row, Icon } from 'antd'

const { Meta } = Card

export default class LiveList extends Component {
    render() {
        const { list } = this.props
        return (
            <Row gutter={16} style={{ width: '100%', height: '100%', padding: '8px 0' }}>
                {
                    list.map(v => (
                        <div key={v.title} className={'zy-card'}>
                            <Col data-live-title={v.title} data-live-encrypted={!!v.hasPass} className={'zy-card'}  lg={6} xxl={4}>
                                <Card
                                    hoverable={true}
                                    cover={<img alt={v.title} src={v.coverURL} />}
                                    actions={[
                                        <Icon data-action={'play-live'} type="caret-right"/>,
                                        v.hasPass ? <Icon type="lock" /> : <Icon type="unlock" />
                                    ]}
                                >
                                    <Meta
                                        title={v.title}
                                        description={!!v.description ? v.description : '无描述'}
                                    />
                                </Card>
                            </Col>
                        </div>
                    ))
                }
            </Row>
        )
    }
}