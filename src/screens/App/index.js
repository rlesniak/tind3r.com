import React, { Component } from 'react';
import CSSModules from 'react-css-modules'
import { observer, inject } from 'mobx-react'
import { observable } from 'mobx'
import { Link, browserHistory } from 'react-router'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'
import ls from 'local-storage'
import { checkIfInstalled } from 'runtime'
import Loader from './shared/Loader'
import styles from './index.scss'

@inject('currentUser')
@observer
@CSSModules(styles)
export default class App extends Component {
  @observable isInstalled = false
  @observable isFetching = true

  constructor(props) {
    super(props)

    this.checkExtension()
  }

  @autobind
  fetchMeta(cb = n => n) {
    this.isFetching = true
    this.props.currentUser.fetchMeta().then((resp) => {
      if (resp.rating.super_likes.resets_at) {
        ls.set({ superLikeExpiration: resp.rating.super_likes.resets_at })
      }

      if (resp.rating.likes_remaining === 0) {
        ls.set({ likeExpiration: resp.rating.rate_limited_until })
      }

      cb()
      this.isFetching = false
    }).catch(() => {
      // browserHistory.push('/welcome')
      this.isFetching = false
    })
  }

  checkExtension() {
    checkIfInstalled((status) => {
      this.isInstalled = !!status

      if (status) {
        this.fetchMeta()
      } else {
        this.isFetching = false
        browserHistory.push('/welcome')
      }
    })
  }

  render() {
    return (
      <div styleName="wrapper">
        <div styleName="page">
          {!this.isFetching && this.props.children && React.cloneElement(this.props.children, {
            currentUser: this.props.currentUser,
            isInstalled: this.isInstalled,
            fetchMeta: this.fetchMeta,
          })}
          {this.isFetching && <Loader isSimpleLoader />}
        </div>
        <div styleName="footer">
          Copyright &copy; <a href="https://goo.gl/6i11L7" target="_blank">Rafal Lesniak</a> | <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    );
  }
}
