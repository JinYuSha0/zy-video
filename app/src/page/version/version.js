import './version.less'

import AppInfo from '../../../package'
import React, { Component } from 'react'
import { sNeedToUpdate } from '../../service/index'
import { Progress } from 'antd'

export default class PageVersion extends Component {
    state = {
        needUpdate: false
    }


    async componentWillMount() {
        const data = await sNeedToUpdate(AppInfo.version)

        if(data.status === 'success' && data.needUpdate) {
            delete data.status
            this.setState({ ...data })
        }
    }

    render() {
        const { needUpdate, newVersion, versionInfo } = this.state
        return (
            <div className={'page-version'}>
                <div className={'wrapper'}>
                    <h1>登录后方可使用所有功能</h1>
                    <h2>
                        当前版本: {AppInfo.version}
                        {needUpdate ? <span className={'new-version'}>最新版本:<span className={'version'}>{newVersion}</span></span> : null
                        }
                    </h2>

                    {
                        needUpdate ? <div className={'new-version-wrapper'}>
                            <div className={'new-version-wrapper-info'}>
                                {
                                    versionInfo.map((v, k) => (
                                        <h2 key={k}>{(k+1) + '.' + v}</h2>
                                    ))
                                }
                            </div>
                            <Progress percent={80} />
                        </div> : null
                    }
                </div>
            </div>
        )
    }
}