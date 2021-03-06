import './player.less'

import moment from 'moment'
import 'moment/locale/zh-cn'
import { store } from '../../index'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addClass, removeClass, jump, fetchGet } from '../../util/util'
import { cUpdateCurrentTime, cPlayNextVideo, cSetPlayList } from '../../redux/reducers/playlist'
import { Modal, message } from 'antd'
import { getRandom } from '../../util/util'
import { sSendDingText } from '../../service/index'

//回播视频hls加密
const VIDEO_OPTIONS = {
    //autoplay: true,
    techOrder: ['html5'],
    html5: {
        withCredentials: true
    },
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
    constructor(props) {
        super(props)
        this.netStatus = true
        this.offlineTime = null
        this.content1 = this.props.user.getIn(['userInfo', 'nickName']) + '正在播放本视频,严禁录音录像!'
        this.content2 = '网络中断,正在尝试重新连接.'
        this.content3 = '网络连接成功,马上开始播放.'
        this.danmuContent = this.content1
    }

    componentDidMount() {
        const { user, playlist, updateCurrentTime } = this.props,
            isVideo = playlist.get('type') === 'video',
            isOpenController = this.isOpenController = user.get('controller'),
            url = playlist.get('url'),
            options = this.options = isVideo ?  VIDEO_OPTIONS : LIVE_OPTIONS,
            index = this.index =  playlist.get('index'),
            currentTime = playlist.get('currentTime'),
            multiple = playlist.get('multiple')

        if(!isOpenController) {
            addClass(this.playerDOM, 'hide-custom-controls')
        }

        window.addEventListener('resize', this.danmuResize)
        this.createPlayer(url, options)

        if(isVideo) {
            this.player.currentTime(currentTime)

            this.player.on('timeupdate', (e) => {
                updateCurrentTime({
                    currentTime: this.player.currentTime(),
                    duration: this.player.duration()
                })
            })

            this.player.on('ended', async (e) => {
                const { playlist } = store.getState(),
                    index = playlist.get('index')+1,
                    size = playlist.get('list').size

                if(multiple && index < size) {
                    this.props.playNextVideo()
                } else {
                    try {
                        const result = await sSendDingText({ remark: '点播已经结束,请安排后续工作' })
                        if(result.status !== 'success') {
                            throw new Error()
                        }
                    } catch (e) {
                        message.error('发送反馈失败!')
                    }

                    if(!!this.timer) {
                        clearInterval(this.timer)
                        this.timer = null
                    }

                    if(!!this.danmuTimer) {
                        clearInterval(this.danmuTimer)
                        this.danmuTimer = null
                    }

                    if(!!this.danmaku) {
                        this.danmaku.destroy()
                        this.danmaku = null
                    }

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
        } else {
            window.addEventListener('offline', this.onOffLine)
            window.addEventListener('online', this.onOnLine)
        }
    }

    componentWillUnmount() {
        const { playlist } = this.props,
            isVideo = playlist.get('type') === 'video'

        if(!isVideo) {
            window.removeEventListener('offline', this.onOffLine)
            window.removeEventListener('online', this.onOnLine)
        }

        if(!!this.player) {
            this.player.pause();
            this.player.dispose()
            this.player = null
        }

        if(!!this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }

        if(!!this.danmuTimer) {
            clearInterval(this.danmuTimer)
            this.danmuTimer = null
        }

        if(!!this.danmaku) {
            window.removeEventListener('resize', this.danmuResize)
            this.danmaku.destroy()
            this.danmaku = null
        }
    }

    componentWillReceiveProps(nextProps) {
        const { playlist, user } = nextProps,
            isOpenController = user.get('controller'),
            index = playlist.get('index'),
            url = playlist.get('url')

        if(this.isOpenController !== isOpenController) {
            if(!this.playerDOM.parentNode) return
            const controllerBar = this.playerDOM.parentNode.querySelector('.vjs-control-bar')
            if(isOpenController) {
                removeClass(this.playerDOM.parentNode, 'hide-custom-controls')
                removeClass(controllerBar, 'hide-custom-controls')
            } else {
                addClass(controllerBar, 'hide-custom-controls')
            }
            this.isOpenController = isOpenController
        }

        if(!!this.player && !!this.player.src && this.index !== index) {
            this.player.src([{
                src: url,
                type: this.options.type
            }])
            this.index = index
        }
    }

    createPlayer = (url, options) => {
        this.player = videojs(this.playerDOM, options)

        this.player.src([{
            src: url,
            type: options.type
        }])

        this.player.on('loadedmetadata', () => {
            this.player.play()
        })
        this.player.on('fullscreenchange', () => {
            this.danmuResize()
        })
        this.player.on('pause', () => {
            this.danmaku.hide()
            this.player.status = 'pause'
        })
        this.player.on('play', () => {
            this.danmaku.show()
            this.player.status = 'play'
        })

        this.danmu = document.createElement('div')
        this.danmu.setAttribute('class', 'danmu')
        document.getElementById('zy-player').appendChild(this.danmu)

        const danmaku = this.danmaku = new Danmaku()
        danmaku.init({
            container: this.danmu
        })
        this.danmuTimer = setInterval(this.emitDanmu, 3*60*1000)
    }

    emitDanmu = (text = this.danmuContent) => {
        if(!this.danmaku) return

        const content = {
            text: text,
            mode: 'ltr',
            style: {
                lineHeight: getRandom(100, this.danmu.clientHeight) + 'px',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#108ee9'
            },
        }

        this.danmaku.emit(content)
    }

    onOffLine = () => {
        this.netStatus = false

        setTimeout(() => {
            if(this.netStatus) return
            this.offlineTime = new Date().getTime()
            this.danmuContent = this.content2
            this.emitDanmu(this.content2)
        }, 3000)
    }

    onOnLine = () => {
        if(!this.netStatus) {
            if(!!this.player) {
                this.player.pause()
                this.player.dispose()
                this.player = null
                console.warn('摧毁播放实例')
            }

            if(!!this.danmaku) {
                window.removeEventListener('resize', this.danmuResize)
                this.danmaku.destroy()
                this.danmaku = null
            }
        }

        this.netStatus = true

        const { playlist } = this.props,
            url = playlist.get('url'),
            isVideo = playlist.get('type') === 'video',
            options = this.options = isVideo ?  VIDEO_OPTIONS : LIVE_OPTIONS

        const player = this.playerDOM = document.createElement('video')
        player.setAttribute('id', 'zy-player')
        player.setAttribute('class', 'video-js vjs-default-skin vjs-big-play-centered')
        player.setAttribute('controls', true)
        this.zyPlayer.insertBefore(player, this.zyPlayer.childNodes[0])

        setTimeout(async () => {
            this.danmuContent = this.content1
            this.createPlayer(url, options)
            this.emitDanmu(this.content3)
            if(!!this.offlineTime) {
                await sSendDingText({ remark: `${moment(this.offlineTime).format('LLLL')} 直播出现网络波动` })
            }
            console.warn('新建播放实例')
        }, 0)
    }

    danmuResize = () => {
        if(!this.danmaku) return
        this.danmaku.resize()
    }

    render() {
        return (
            <div className="zy-player" ref={zyPlayer => this.zyPlayer = zyPlayer}>
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