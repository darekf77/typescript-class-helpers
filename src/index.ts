
import * as _ from 'lodash';
import { CLASSNAME } from './classname';
import { describeFromClassStringify, describeByDefaultModelsAndMapping } from './describe-class';
import { Models } from './models';
import { SYMBOL } from './symbols';
import { getStorage } from './storage';
export class Helpers {

  static getBy(className: string | Function) {
    return CLASSNAME.getClassBy(className);
  }

  static getFromObject(o: Object) {
    if (_.isUndefined(o) || _.isNull(o)) {
      return;
    }
    const p = Object.getPrototypeOf(o)
    return p && p.constructor;
  }

  static getName(target: Function, production = false) {
    return CLASSNAME.getClassName(target, production)
  }

  static getNameFromObject(o: Object) {
    return this.getName(this.getFromObject(o));
  }

  static getConfig(target: Function): Models.ClassConfig[] {
    return CLASSNAME.getClassConfig(target)
  }

  static describeProperites(target: Function) {
    const d1 = describeFromClassStringify(target);
    const d2 = describeByDefaultModelsAndMapping(target);
    let uniq = {};
    d1.concat(d2).forEach(p => uniq[p] = p);
    return Object.keys(uniq)
      .filter(d => !!d)
      .filter(d => typeof target.prototype[d] !== 'function')
  }



}


export const CLASS = {
  NAME: CLASSNAME.CLASSNAME,
  getBy: Helpers.getBy,
  getSingleton<T = any>(target: Function) {
    if (typeof target !== 'function') {
      console.error(`[typescript-class-helpers][setSingletonObj] Type of target is not a function`)
      return
    }

    const singletons = getStorage(SYMBOL.SINGLETONS);
    const className = CLASS.getName(target);
    if (!singletons[className]) {
      console.error(`[typescript-class-helpers] There is no singleton class for "${className}"`)
      return
    }
    return singletons[className] as T;
  },
  setSingletonObj(target: Function, obj: any) {
    // console.log('SET SINGLETON')
    if (typeof target !== 'function') {
      console.error(`[typescript-class-helpers][setSingletonObj] Type of target is not a function`)
      return
    }

    if (Array.isArray(obj)) {
      console.error(`[typescript-class-helpers][setSingletonObj] Singleton instance cant be an array`)
      return
    }

    if (typeof obj !== 'object') {
      console.error(`[typescript-class-helpers][setSingletonObj] Singleton instance cant must be a object`)
      return
    }

    const singletons = getStorage(SYMBOL.SINGLETONS);
    const className = CLASS.getName(target);

    if (singletons[className] && singletons[className] !== obj) {
      console.warn(`[typescript-class-helpers] You are trying to set singleton of "${className}" second time with different object.`)
    }
    // console.log(`SINGLETON SET for TARGET ${className}`)
    singletons[className] = obj;
  },
  getConfig: Helpers.getConfig,
  getFromObject: Helpers.getFromObject,
  getName: Helpers.getName,
  getNameFromObject: Helpers.getNameFromObject,
  describeProperites: Helpers.describeProperites,
  OBJECT: (obj: any) => {
    return {
      get indexValue() {
        return CLASSNAME.getObjectIndexValue(obj);
      },
      get indexProperty() {
        return CLASSNAME.getObjectIndexPropertyValue(obj);
      },
      get isClassObject() {

        if (!_.isObject(obj) || _.isArray(obj) || _.isRegExp(obj) ||
          _.isBuffer(obj) || _.isArrayBuffer(obj)) {
          return false;
        }
        if (_.isDate(obj)) {
          return true;
        }
        const className = CLASS.getNameFromObject(obj)
        return _.isString(className) && className !== 'Object';
      },
      isEqual: (anotherObj: any, compareDeep = false) => {
        if (!CLASS.OBJECT(obj).isClassObject || !CLASS.OBJECT(anotherObj).isClassObject) {
          return false;
        }
        if (obj === anotherObj) {
          // console.log(`EQ v1: , v2:  - class1 ${CLASS.getNameFromObject(obj)}, class2 ${CLASS.getNameFromObject(anotherObj)}`, obj, anotherObj)
          return true;
        }
        const v1 = CLASSNAME.getObjectIndexValue(obj);
        const v2 = CLASSNAME.getObjectIndexValue(anotherObj);
        const f1 = CLASSNAME.getObjectClassFamily(obj)
        const f2 = CLASSNAME.getObjectClassFamily(anotherObj)
        const isFamilyDiff = (!_.isString(f1) || !_.isString(f2) || (f1 !== f2));
        // console.log(`DIFF FAMILY ${isFamilyDiff} v1: ${CLASSNAME.getObjectClassFamily(obj)}, v2: ${CLASSNAME.getObjectClassFamily(anotherObj)} - class1 ${CLASS.getNameFromObject(obj)}, class2 ${CLASS.getNameFromObject(anotherObj)}`)
        if (isFamilyDiff) {
          // console.log(`DIFF v1: ${v1}, v2: ${v2} - class1 ${CLASS.getNameFromObject(obj)}, class2 ${CLASS.getNameFromObject(anotherObj)}`)
          return false;
        }
        if (!CLASS.OBJECT(obj).isClassObject || !CLASS.OBJECT(anotherObj).isClassObject) {
          // console.log(`NOT CLASS v1: ${v1}, v2: ${v2} - class1 ${CLASS.getNameFromObject(obj)}, class2 ${CLASS.getNameFromObject(anotherObj)}`)
          return false
        }

        // console.log(`v1: ${v1} ,class ${CLASS.getNameFromObject(obj)} ,prop: ${CLASS.OBJECT(obj).indexProperty}`)
        // console.log(`v2: ${v2} ,class ${CLASS.getNameFromObject(anotherObj)} ,prop: ${CLASS.OBJECT(anotherObj).indexProperty}`)
        // console.log(`v1: ${v1}, v2: ${v2} - class1 ${CLASS.getNameFromObject(obj)}, class2 ${CLASS.getNameFromObject(anotherObj)}`)
        // console.log('')
        if ((_.isNumber(v1) && _.isNumber(v2)) || (_.isString(v1) && _.isString(v2))) {

          const res = (v1 === v2);

          return res;
        }
        if (compareDeep) {
          return _.isEqual(v1, v2)
        }
        return false;
      }
    }
  }
}

