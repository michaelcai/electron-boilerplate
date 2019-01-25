import { createBrowserHistory, createMemoryHistory, History, MemoryHistory } from 'history'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import DevTools, { configureDevtool } from 'mobx-react-devtools'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import React, { Fragment } from 'react'
import { Route, Router } from 'react-router-dom'

import Routes from './routes'
import RootStore from './stores/root'

// Configure mobx
configure({
  enforceActions: 'observed'
})

// Configure Devtool
configureDevtool({
  logEnabled: true,
  updatesEnabled: false,
  logFilter: change => ['reaction', 'action', 'when'].some(type => type === change.type)
})

let history: History<any> | MemoryHistory<any>
if (process.env.REACT_APP_ENV === 'development' && !process.env.IS_RENDERER) {
  // Use browser history in development
  history = createBrowserHistory()
} else {
  history = createMemoryHistory()
}

const routingStore = new RouterStore()

const historyStore = syncHistoryWithStore(history, routingStore)

const rootStore = new RootStore()

class App extends React.Component {
  public render() {
    return (
      <Provider {...rootStore}>
        <Fragment>
          <Router history={historyStore}>
            <Route component={Routes} />
          </Router>
          {process.env.REACT_APP_ENV === 'development' && <DevTools />}
        </Fragment>
      </Provider>
    )
  }
}

export default App
