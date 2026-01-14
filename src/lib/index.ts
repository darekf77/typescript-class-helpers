import { _ } from 'tnp-core/src';
import { CLASSNAME } from './classname';
import { describeFromClassStringify, describeByDefaultModelsAndMapping } from './describe-class';
import { Models } from './models';
import { setClassName } from './set-class-name';

export { Models } from './models';
export { SYMBOL } from './symbols';

export class TchHelpers {

  static getBy(className: string | Function) {
    return CLASSNAME.getClassBy(className);
  }

  static getFromObject(o: Object) {
    if (_.isUndefined(o) || _.isNull(o)) {
      return;
    }
    if (o.constructor) {
      return o.constructor;
    }
    const p = Object.getPrototypeOf(o);
    return p && p.constructor;
  }

  static getName(target: Function, production = false) {
    return CLASSNAME.getClassName(target, production) as string;
  }

  static getNameFromObject(o: Object) {
    const fnCLass = this.getFromObject(o);
    return this.getName(fnCLass);
  }

  static getConfigs(target: Function): Models.ClassConfig[] {
    return CLASSNAME.getClassConfig(target)
  }

  static describeProperites(target: Function) {
    const d1 = describeFromClassStringify(target);
    const d2 = describeByDefaultModelsAndMapping(target);
    let uniq = {};
    // @ts-ignore
    d1.concat(d2).forEach(p => uniq[p] = p);
    return Object.keys(uniq)
      .filter(d => !!d)
      .filter(d => typeof target.prototype[d] !== 'function')
  }

}

const notAllowedAsMethodName = [
  'length', 'name',
  'arguments', 'caller',
  'constructor', 'apply',
  'bind', 'call',
  'toString',
  '__defineGetter__',
  '__defineSetter__', 'hasOwnProperty',
  '__lookupGetter__', '__lookupSetter__',
  'isPrototypeOf', 'propertyIsEnumerable',
  'valueOf', '__proto__', 'toLocaleString',
];

const getMethodsNames = (classOrClassInstance: any, allMethodsNames = []): string[] => {
  if (!classOrClassInstance) {
    return allMethodsNames;
  }

  const isClassFunction = _.isFunction(classOrClassInstance);
  const classFun = (isClassFunction ? classOrClassInstance : Object.getPrototypeOf(classOrClassInstance));
  const objectToCheck = isClassFunction ? (classOrClassInstance as Function)?.prototype : classOrClassInstance;
  const prototypeObj = Object.getPrototypeOf(objectToCheck || {});

  const properties = _.uniq([
    ...Object.getOwnPropertyNames(objectToCheck || {}),
    ...Object.getOwnPropertyNames(prototypeObj || {}),
    ...Object.keys(objectToCheck || {}),
    ...Object.keys(prototypeObj || {}),
  ])
    .filter(f => !!f && !notAllowedAsMethodName.includes(f));

  properties.filter((methodName) => typeof objectToCheck[methodName] === 'function').forEach(p => allMethodsNames.push(p));

  if (!classFun || !classFun.constructor || classFun?.constructor?.name === 'Object') {
    return allMethodsNames;
  }
  return getMethodsNames(Object.getPrototypeOf(classFun), allMethodsNames);
};

export const CLASS = {
  NAME: CLASSNAME.CLASSNAME,
  setName: setClassName,
  getBy: TchHelpers.getBy,
  /**
   * @deprecated
   */
  getSingleton<T = any>(target: Function) {
    if (typeof target !== 'function') {
      console.error(`[typescript-class-helpers][setSingletonObj] Type of target is not a function`)
      return
    }
    const config = TchHelpers.getConfigs(target)[0]
    // console.log(`getSingleton for ${target.name}: `, config.singleton)

    return config.singleton as T;
  },
  /**
   * @deprecated
   */
  setSingletonObj(target: Function, singletonObject: any) {
    // console.log('SET SINGLETON', singletonObject)
    if (typeof target !== 'function') {
      console.error(`[typescript-class-helpers][setSingletonObj] Type of target is not a function`)
      return
    }

    if (Array.isArray(singletonObject)) {
      console.error(`[typescript-class-helpers][setSingletonObj] Singleton instance cant be an array`)
      return
    }

    if (typeof singletonObject !== 'object') {
      console.error(`[typescript-class-helpers][setSingletonObj] Singleton instance cant must be a object`)
      return
    }

    const className = CLASS.getName(target);


    // console.log(`SINGLETON SET for TARGET ${className}`)
    const config = TchHelpers.getConfigs(target)[0]

    if (config.singleton) {
      console.warn(`[typescript-class-helpers] You are trying to set singleton of "${className}" second time with different object.`)
    }

    config.singleton = singletonObject;
  },
  /**
   * @deprecated
   */
  getConfigs: TchHelpers.getConfigs,
  /**
   * @deprecated
   */
  getConfig: (target: Function) => {
    return _.first(TchHelpers.getConfigs(target));
  },


  getMethodsNames(classOrClassInstance: any): string[] {
    return getMethodsNames(classOrClassInstance);
  },
  getFromObject: TchHelpers.getFromObject,
  getName: TchHelpers.getName,
  getNameFromObject: TchHelpers.getNameFromObject,
  describeProperites: TchHelpers.describeProperites,
  /**
   * @deprecated
   */
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
          // @ts-ignore
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

