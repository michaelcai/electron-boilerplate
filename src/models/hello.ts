import { observable, computed } from 'mobx'

class Hello {
  @observable
  private _text:string
  constructor(text:string) {
    this._text = text
  }

  @computed
  get text() {
    return this._text
  }
}

export default Hello