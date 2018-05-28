import './leftBar.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cOpenLeftBar, cCloseLeftBar } from "../../redux/reducers/leftBar"
import { cRemovePlay, cSetPlayList } from '../../redux/reducers/playlist'
import { Icon, Badge, Select, Input, message, Tooltip, List, Button } from 'antd'
import { sGetAllClassify } from '../../service/index'

const Option = Select.Option

class LeftBar extends Component {
    state = {
        classifyList: []
    }

    async componentWillMount() {
        const classifyRes = await sGetAllClassify()
        if(classifyRes.status === 'success') {
            this.setState({
                classifyList: classifyRes.list
            })
        } else {
            message.error('获取视频分类失败!')
        }
    }

    onClick =() => {
        const { leftBar, open, close } = this.props
        if(leftBar.get('isOpen')) {
            close()
        } else {
            open()
        }
    }

    refresh = () => {
        const { dataSource } = this.props,
            activeKey = dataSource.get('activeKey')
        switch (activeKey) {
            case 'live':
                break
            case 'video':
                break
        }
    }

    render() {
        const { leftBar, playlist, removePlay, setPlayList } = this.props,
            isOpen = leftBar.get('isOpen'),
            { classifyList } = this.state

        return (
            <div className={'side-bar-wrapper'}>
                <div className={leftBar.get('className')}>
                    <div className={'side-bar'}>

                        {
                            isOpen ?
                                <div className={'side-bar-big'}>
                                    <div className={'wrapper search-wrapper'}>
                                        <div className={'title'}>
                                            <i></i>
                                            <span>视频搜索</span>
                                        </div>

                                        <div className={'body'}>
                                            <Input
                                                placeholder={'搜索标题'}
                                                style={{ width: 180, padding: '0 2px'  }}
                                                suffix={<Icon type="search" />}
                                            />
                                        </div>
                                    </div>

                                    <div className={'wrapper classify-wrapper'}>
                                        <div className={'title'}>
                                            <i></i>
                                            <span>视频分类</span>
                                        </div>

                                        <div className={'body'}>
                                            <Select
                                                showSearch
                                                style={{ width: 180, padding: '0 2px'  }}
                                                placeholder={'视频分类'}
                                                optionLabelProp={'children'}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {
                                                    classifyList.map(v => (
                                                        <Option key={v.cateId} value={v.cateId}>
                                                            <Tooltip placement="right" title={v.cateName}>
                                                                {v.cateName}
                                                            </Tooltip>
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                    </div>

                                    <div className={'wrapper playlist-wrapper'}>
                                        <div className={'title'}>
                                            <i></i>
                                            <span>播放列表</span>
                                        </div>

                                        {
                                            playlist.get('list') && playlist.get('list').size > 0 ? (
                                                <div className={'body'}>
                                                    <List
                                                        dataSource={playlist.get('list')}
                                                        renderItem={(v, k) => (
                                                            <List.Item key={v.id}>
                                                                <List.Item.Meta
                                                                    title={(k+1) + '.' + v.title}
                                                                />
                                                                <Icon onClick={() => {removePlay(k)}} type="close" style={{ color: '#d0d0d0', fontSize: 14, padding: 4, cursor: 'pointer' }}/>
                                                            </List.Item>
                                                        )}
                                                    />

                                                    <div className={'btn-container'}>
                                                        <Button type="danger" size={'small'} onClick={() => {setPlayList([])}}>清空</Button>
                                                        <Button type="primary" size={'small'}>播放</Button>
                                                    </div>
                                                </div>
                                            ) : <p className={'list-no-data'}>未添加</p>
                                        }
                                    </div>

                                </div>
                                :
                                <ul className={'side-bar-small'}>
                                    <li className={'small-item'} onClick={this.refresh}>
                                        <Icon type="reload" style={{ fontSize: 18 }}/>
                                        <span>刷新</span>
                                    </li>

                                    <li className={'small-item'}>
                                        <Icon type="search" style={{ fontSize: 18 }}/>
                                        <span>搜索</span>
                                    </li>

                                    <li className={'small-item'}>
                                        <Icon type="switcher" style={{ fontSize: 18 }}/>
                                        <span>分类</span>
                                    </li>

                                    <li className={'small-item'}>
                                        <Badge count={playlist.get('list').size}>
                                            <Icon type="profile" style={{ fontSize: 18 }}/>
                                        </Badge>
                                        <span>列表</span>
                                    </li>
                                </ul>
                        }

                    </div>

                    <a className={'bar-btn'} onClick={this.onClick}></a>
                </div>
            </div>
        )
    }
}

export default connect(
    ({ leftBar, playlist, dataSource }) => ({ leftBar, playlist, dataSource }),
    (dispatch) => bindActionCreators({
        open: cOpenLeftBar,
        close: cCloseLeftBar,
        removePlay: cRemovePlay,
        setPlayList: cSetPlayList,
    }, dispatch)
)(LeftBar)