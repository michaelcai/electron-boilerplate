import React from 'react'

interface Props {
  text: string
}

class Hello extends React.Component<Props> {
  render() {
    return <p>{this.props.text}</p>
  }
}

export default Hello