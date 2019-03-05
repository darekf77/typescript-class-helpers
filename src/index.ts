
import * as _ from 'lodash';
import { CLASSNAME } from './classname';
import { describeFromClassStringify, describeByDefaultModelsAndMapping } from './describe-class';
import { Models } from './models';
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

  static getConfig(target: Function, configs: Models.ClassConfig[] = []): Models.ClassConfig[] {
    return CLASSNAME.getClassConfig(target, configs)
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
        if (_.isNumber(obj)) {
          return false;
        }
        if (_.isString(obj)) {
          return false;
        }
        if (_.isRegExp(obj)) {
          return false;
        }
        if (_.isBoolean(obj)) {
          return false;
        }
        if (_.isDate(obj)) {
          return false;
        }
        if (_.isArray(obj)) {
          return false;
        }
        if (!_.isObject(obj)) {
          return false;
        }
        const className = CLASS.getNameFromObject(obj)
        return _.isString(className) && className !== 'Object';
      },
      isEqual: (anotherObj: any, compareDeep = false) => {
        if (obj === anotherObj) {
          return true;
        }
        if (CLASS.getNameFromObject(obj) !== CLASS.getNameFromObject(anotherObj)) {
          return false;
        }
        const v1 = CLASSNAME.getObjectIndexValue(obj);
        const v2 = CLASSNAME.getObjectIndexValue(anotherObj);
        // console.log(`v1: ${v1}`)
        // console.log(`v2: ${v2}`)
        if (_.isNumber(v1) && _.isNumber(v2)) {
          // console.log(`v1: ${v1}, v2: ${v2} - class ${CLASS.getNameFromObject(obj)}`)
          return (v1 === v2);
        }
        if (compareDeep) {
          return _.isEqual(v1, v2)
        }
        return false;
      }
    }
  }
}

