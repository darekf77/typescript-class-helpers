import { Helpers } from 'ng2-logger';
import { SYMBOL } from './symbols';
import * as _ from 'lodash'

declare const window;
declare const globalThis;
declare const global;

function defaultValues() {
  return _.cloneDeep({
    [SYMBOL.CLASSES]: [],
    [SYMBOL.SINGLETONS]: {}
  })
}

export function getStorage<T = any>(property?: string): T {

  //#region @backend
  if (Helpers.isBrowser) {
    console.trace(`[tch][getStorage] You bundle contains backend files`)
  }
  //#endregion
  if (typeof property === 'string') {

    const storageInClassStaticProp = getStorage();
    return storageInClassStaticProp[property]
  }

  if (Helpers.isBrowser) {
    if (typeof globalThis[SYMBOL.STORAGE] === 'undefined') {
      globalThis[SYMBOL.STORAGE] = defaultValues()
    }
    return globalThis[SYMBOL.STORAGE]
  }

  //#region @backend
  if (Helpers.isNode) {
    if (typeof defaultValues.prototype[SYMBOL.STORAGE] === 'undefined') {
      defaultValues.prototype[SYMBOL.STORAGE] = defaultValues()
    }
    return defaultValues.prototype[SYMBOL.STORAGE]
  }
  //#endregion

}

