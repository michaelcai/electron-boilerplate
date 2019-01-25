import React from 'react'
import {inject, observer} from 'mobx-react'

import HelloComponent from '@/components/hello'
import HelloStore from '@/stores/hello'

interface Props {
  hello: HelloStore
}

@inject('hello')
@observer
class Hello extends React.Component<Props> {
  render() {
    return <HelloComponent text={this.props.hello.hello.text} />
  }
}

export default Hello
