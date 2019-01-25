import RootStore from './root'
import HelloModel from '@/models/hello'
import { observable } from 'mobx'


class HelloStore {
  @observable
  private _root:RootStore

  @observable
  private _hello: HelloModel

  constructor(root:RootStore) {
    this._root = root
    this._hello = new HelloModel('Hello World')
  }

  get root () {
    return this._root
  }

  get hello() {
    return this._hello
  }
}

export default HelloStore