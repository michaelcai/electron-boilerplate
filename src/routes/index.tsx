import { observer } from 'mobx-react'
import React, { Fragment } from 'react'
import HelloContainer from '@/containers/hello'
import { Switch, Route } from 'react-router'

@observer
class Routes extends React.Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/" exact={true} component={HelloContainer} />
        </Switch>
      </Fragment>
    )
  }
}

export default Routes
