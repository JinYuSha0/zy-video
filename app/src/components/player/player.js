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
        const { playlist } = this.props,
            isVideo = playlist.get('type') === 'video',
            url = playlist.get('url'),
            options = isVideo ? VIDEO_OPTIONS : LIVE_OPTIONS

        const player = this.player = videojs('zy-player', options)
        this.player.src([{
            src: url,
            type: options.type
        }])
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