import { Helpers } from 'ng2-logger';
import { SYMBOL } from './symbols';
import * as _ from 'lodash'

declare const window;
declare const globalThis;

function defaultValues() {
  return _.cloneDeep({
    [SYMBOL.CLASSES]: [],
    [SYMBOL.SINGLETONS]: {}
  })
}

export function getStorage<T = any>(property?: string): T {

  // //#region @backend
  // if (Helpers.isBrowser) {
  //   debugger
  // }
  // //#endregion

  if (typeof property === 'string') {

    const storageInClassStaticProp = getStorage();
    return storageInClassStaticProp[property]
  }

  if (typeof globalThis[SYMBOL.STORAGE] === 'undefined') {
    globalThis[SYMBOL.STORAGE] = defaultValues()
  }
  return globalThis[SYMBOL.STORAGE]

}

