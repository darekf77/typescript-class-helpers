import { Helpers } from 'ng2-logger';
import { SYMBOL } from './symbols';
import * as _ from 'lodash'

function defaultValues() {
  return _.cloneDeep({
    [SYMBOL.CLASSES]: [],
    [SYMBOL.SINGLETONS]: {}
  })
}

export function getStorage<T = any>(property?: string): T {

  //#region @backend
  if (Helpers.isBrowser && !Helpers.simulateBrowser) {
    console.trace(`[typescript-class-helpers][getStorage] You bundle contains backend files`)
  }
  //#endregion

  if (typeof property === 'string') {

    const storageInClassStaticProp = getStorage();
    return storageInClassStaticProp[property]
  }

  if (typeof defaultValues.prototype[SYMBOL.STORAGE] === 'undefined') {
    defaultValues.prototype[SYMBOL.STORAGE] = defaultValues()
  }
  return defaultValues.prototype[SYMBOL.STORAGE]
}

