import './player.less'

import { store } from '../../index'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addClass, removeClass, jump } from '../../util/util'
import { cUpdateCurrentTime, cPlayNextVideo, cSetPlayList } from '../../redux/reducers/playlist'
import { Modal } from 'antd'

//回播视频hls加密
const VIDEO_OPTIONS = {
    autoplay: true,
    techOrder: ['html5'],
    html5: {
        withCredentials: true
    },
    loop: false,
    playbackRates: [0.75, 1, 1.25, 1.5, 2],
    controlBar: {
        remainingTimeDisplay: true,
        progressControl: true,
        volumePanel: {
            inline: false
        }
    },
    type: 'video/mp4'
}

//直播视频flv
const LIVE_OPTIONS = {
    autoplay: true,
    techOrder: ['html5', 'flvjs'],
    flvjs: {
        mediaDataSource: {
            isLive: true,
            cors: true,
            withCredentials: false,
        },
    },
    controlBar: {
        remainingTimeDisplay: false,
        progressControl: false,
        volumePanel: {
            inline: false
        }
    },
    type: 'video/x-flv'
}

class Player extends Component {
    componentDidMount() {
        const { user, playlist, updateCurrentTime } = this.props,
            isVideo = playlist.get('type') === 'video',
            isOpenController = this.isOpenController = user.get('controller'),
            url = this.url = playlist.get('url'),
            options = this.options = isVideo ?  VIDEO_OPTIONS : LIVE_OPTIONS,
            currentTime = playlist.get('currentTime'),
            multiple = playlist.get('multiple')

        if(!isOpenController) {
            addClass(this.playerDOM, 'hide-custom-controls')
        }

        const player = this.player = videojs(this.playerDOM, options)
        this.player.src([{
            src: url,
            type: options.type
        }])

        if(isVideo) {
            this.player.currentTime(currentTime)

            player.on('timeupdate', (e) => {
                updateCurrentTime({
                    currentTime: this.player.currentTime(),
                    duration: this.player.duration()
                })
            })

            player.on('ended', (e) => {
                const { playlist } = store.getState(),
                    index = playlist.get('index')+1,
                    size = playlist.get('list').size

                if(multiple && index < size) {
                    this.props.playNextVideo()
                } else {
                    Modal.success({
                        title: '本次播放已经完成',
                        content: '如需继续播放请通知管理员',
                        onOk: () => {
                            jump('/')
                            this.props.setPlayList([])
                        }
                    })
                }
            })
        }
    }

    componentWillUnmount() {
        if(!!this.player) {
            this.player.pause();
            this.player.dispose()
            this.player = null
        }
    }

    componentWillReceiveProps(nextProps) {
        const { playlist, user } = nextProps,
            isOpenController = user.get('controller'),
            url = playlist.get('url')

        if(this.isOpenController !== isOpenController) {
            const controllerBar = this.playerDOM.parentNode.querySelector('.vjs-control-bar')
            if(isOpenController) {
                removeClass(this.playerDOM.parentNode, 'hide-custom-controls')
                removeClass(controllerBar, 'hide-custom-controls')
            } else {
                addClass(controllerBar, 'hide-custom-controls')
            }
            this.isOpenController = isOpenController
        }

        if(this.url !== url) {
            this.player.src([{
                src: url,
                type: this.options.type
            }])
            this.url = url
        }
    }

    render() {
        return (
            <div className="zy-player">
                <video ref={player => this.playerDOM = player} id="zy-player" className="video-js vjs-default-skin vjs-big-play-centered" controls/>
            </div>
        )
    }
}

export default connect(
    ({ user, playlist }) => ({ user, playlist }),
    (dispatch) => bindActionCreators({
        updateCurrentTime: cUpdateCurrentTime,
        playNextVideo: cPlayNextVideo,
        setPlayList: cSetPlayList,
    }, dispatch)
)(Player)