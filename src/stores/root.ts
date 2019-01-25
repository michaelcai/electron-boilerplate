import HelloStore from './hello'

class RootStore {
  hello: HelloStore
  constructor() {
    this.hello = new HelloStore(this)
  }
}

export default RootStore
