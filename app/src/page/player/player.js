import './player.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Player from '../../components/player/player'

class PagePlayer extends Component {
    render() {
        return (
            <div className={'page-player'}>
                <Player/>
            </div>
        )
    }
}

export default connect(
    ({}) => ({}),
    (dispatch) => bindActionCreators({
    }, dispatch)
)(PagePlayer)