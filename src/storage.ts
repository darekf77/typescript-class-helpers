import { Helpers } from 'ng2-logger';
import { SYMBOL } from './symbols';

declare const window;

export function getStorage<T = any>(property?: string): T {
  if (typeof property === 'string') {
    // console.log('SET STORAGE!!!!!!!!!!!!!!!!!!!!', property)
    const s = getStorage();
    // console.log('SET STORAGE!!!!!!!!!!!!!!!!!!!!', s)
    if (typeof s[property] === 'undefined') {
      s[property] = {};
    }
    // console.log('SET STORAGE after', s)
    return s[property]
  }
  // console.log('Helpers.isBrowser', Helpers.isBrowser)
  if (Helpers.isBrowser && !Helpers.simulateBrowser) {
    if (!window[SYMBOL.STORAGE]) {
      window[SYMBOL.STORAGE] = {
        classes: []
      }
    }
    return window[SYMBOL.STORAGE]
  }
  //#region @backend
  if (!getStorage[SYMBOL.STORAGE]) {
    getStorage[SYMBOL.STORAGE] = {
      classes: []
    }
  }
  return getStorage[SYMBOL.STORAGE]
  //#endregion
}

