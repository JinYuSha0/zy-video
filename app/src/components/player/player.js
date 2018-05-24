import './player.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//回播视频hls加密
const VIDEO_OPTIONS = {
    autoplay: true,
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
    type: 'application/x-mpegURL'
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
        //直播
        const player = this.player = videojs('zy-player', LIVE_OPTIONS)
        this.player.src([{
            src: 'http://fms.cntv.lxdns.com/live/flv/channel84.flv',
            type: 'video/x-flv'
        }])

        //回播
        /*const player = this.player = videojs('zy-player', VIDEO_OPTIONS)
        this.player.src([{
            src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
            type: 'application/x-mpegURL'
        }])*/
    }

    componentWillUnmount() {
        if(!!this.player) {
            this.player.pause();
            this.player.dispose()
            this.player = null
        }
    }

    render() {
        return (
            <div className="zy-player">
                <video id="zy-player" className="video-js vjs-default-skin" controls/>
            </div>
        )
    }
}

export default connect(
    ({ playlist }) => ({ playlist }),
    (dispatch) => bindActionCreators({
    }, dispatch)
)(Player)