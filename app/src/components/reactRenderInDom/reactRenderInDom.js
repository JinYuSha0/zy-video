import React, { Component } from 'react'
import ReactDom from 'react-dom'

/**
 * @param parentNode
 * @param children
 * @param id
 */

class ReactRenderInDom extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { parentNode, children, id } = this.props
        if(!!parentNode && !!children) {
            this.wrapper = document.createElement('div')
            this.wrapper.setAttribute('class', 'ReactRenderInDom')
            if(id) this.wrapper.setAttribute('id', id)
            parentNode.appendChild(this.wrapper)
            this._render(children, this.wrapper)
        }
    }

    componentWillReceiveProps(nextProps) {
        const { children } = nextProps
        this._render(children, this.wrapper)
    }

    componentWillUnmount() {
        this.props.parentNode.removeChild(this.wrapper)
    }

    _render(children, wrapper) {
        ReactDom.render(children, wrapper)
    }

    render() {
        return null
    }
}