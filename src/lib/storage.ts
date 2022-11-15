import { Helpers } from 'tnp-core';
import { SYMBOL } from './symbols';
import { _ } from 'tnp-core';

function defaultValues() {
  return _.cloneDeep({
    [SYMBOL.CLASSES]: []
  })
}

export function getStorage<T = any>(property?: string): T {

  //#region @backend
  if (Helpers.isBrowser) {
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

