import { Helpers } from 'ng2-logger';
import { SYMBOL } from './symbols';
import * as _ from 'lodash'

declare const window;

function defaultValues() {
  return _.cloneDeep({
    [SYMBOL.CLASSES]: [],
    [SYMBOL.SINGLETONS]: {}
  })
}

export function getStorage<T = any>(property?: string): T {
  if (typeof property === 'string') {

    const storageInClassStaticProp = getStorage();
    return storageInClassStaticProp[property]
  }

  if (typeof getStorage[SYMBOL.STORAGE] === 'undefined') {
    getStorage[SYMBOL.STORAGE] = defaultValues()
  }
  return getStorage[SYMBOL.STORAGE]

}

