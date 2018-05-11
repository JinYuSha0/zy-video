import './randomModal.less'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { isParent } from '../../util/util'

class RandomModal extends Component {
    render() {
        const { width, height, top, left, _children, remove } = this.props
        return (
            <div className="randomModal" style={{width, height, top, left}}>{_children}</div>
        )
    }
}

export default function (children, ele, width = 300, height = 300)  {
    this.randomEle = null

    const getCoord = () => {
        const eWidth = ele.clientWidth,
            eWeight = ele.clientHeight,
            top = ele.offsetTop,
            left = ele.offsetLeft
        return {top: top+eWeight+16, left: left-(width/2)+(eWidth/2)}
    }
    const remove = this.remove = (e) => {
        document.body.removeChild(this.randomEle)
        document.body.removeEventListener('click', remove)
        window.removeEventListener('resize', reRender)
    }
    const reRender = this.reRender = () => {
        const {top, left} = getCoord()
        render(<RandomModal width={width} height={height} top={top} left={left} _children={children}/>, this.randomEle)
    }
    const create = () => {
        const randomEle = this.randomEle = document.createElement('div')
        randomEle.className = 'randomModalWrapper'
        document.body.appendChild(randomEle)
        const {top, left} = getCoord()
        render(<RandomModal width={width} height={height} top={top} left={left} _children={children}/>, randomEle)
        document.body.addEventListener('click', remove)
        window.addEventListener('resize', reRender)
    }

    create()
}