import { _ } from 'tnp-core';
import { Models } from './models';
import { SYMBOL } from './symbols';
import { Helpers } from './index';
import { Helpers as ConfigHelpers } from 'tnp-core';
import { getStorage } from './storage';
import { setClassName } from './set-class-name';

function getClasses(): Models.ClassMeta[] {
  const s = getStorage();
  return s[SYMBOL.CLASSES] as any;
}

export namespace CLASSNAME {

  export function getClassConfig(target: Function, configs: Models.ClassConfig[] = []): Models.ClassConfig[] {
    if (!_.isFunction(target)) {
      throw `[typescript-class-helper][getClassConfig] Cannot get class config from: ${target}`
    }

    const meta = SYMBOL.CLASS_META_CONFIG;
    let config: Models.ClassConfig;

    // @ts-ignore
    if (!target[meta]) {
      config = new Models.ClassConfig();
      config.classReference = target;
    } else {
      // @ts-ignore
      config = target[meta];
      var parentClass = Object.getPrototypeOf(target)
      if (config.classReference === parentClass) {
        const childConfig = new Models.ClassConfig();
        childConfig.vParent = config;
        childConfig.classReference = target;
        // @ts-ignore
        config.vChildren.push(childConfig)
        config = childConfig;
      }
    }
    // @ts-ignore
    target[meta] = config;
    configs.push(config);
    return (_.isFunction(parentClass) && parentClass.name !== '') ? getClassConfig(parentClass, configs) : configs;
  }

  /**
   * PLEASE PROVIDE NAME AS TYPED STRING, NOT VARIABLE
   * Decorator requred for production mode
   * @param name Name of class
   */
  export function CLASSNAME(className: string,
    options?: Models.CLASSNAMEOptions) {
    return function (target: Function) {
      // console.log(`CLASSNAME Inited ${className}`)
      return setClassName(target, className, options);
    } as any;
  }

  export function getClassName(target: Function, production = false) {
    if (_.isString(target)) {
      console.trace(target);
      console.warn(`[typescript-class-helpers][getClassName] target is string: '${target}', produciton: ${production}`)
      return target;
    }
    if (!_.isFunction(target)) {
      console.trace(target);
      console.error(`[typescript-class-helpers][getClassName] target is not a class`)
      return void 0;
    }

    // @ts-ignore
    if (ConfigHelpers.isBrowser && _.isString(target[SYMBOL.CLASSNAMEKEYBROWSER])) {
      // @ts-ignore
      return target[SYMBOL.CLASSNAMEKEYBROWSER];
    }
    // @ts-ignore
    if (target[SYMBOL.CLASSNAMEKEY]) {
      // @ts-ignore
      return target[SYMBOL.CLASSNAMEKEY];
    }
    if (production) {
      console.error(`[typescript-class-helpers][getClassName(...)](PRODUCTION MODE ERROR)
              Please use decoartor @CLASSNAME for each entity or controller
              This is preventing class name problem in minified code.

              import { CLASS } from 'typescript-class-helpers';

              @CLASS.NAME('ExampleClass')
              class ExampleClass {
                ...
              }
              `, target)
    }
    return target.name;
  }

  // @ts-ignore
  export function getObjectIndexPropertyValue(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = getClasses().find(c => c.className === className);
    // console.log('c',c)
    if (c) {
      return c.uniqueKey;
    }
  }

  // @ts-ignore
  export function getClassFamilyByClassName(className: string) {
    let c = getClasses().find(c => c.className === className);
    // console.log('getClasses()', getClasses())
    if (c) {
      return c.classFamily;
    }
  }

  // @ts-ignore
  export function getObjectClassFamily(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = getClasses().find(c => c.className === className);
    // console.log('c',c)
    if (c) {
      return c.classFamily;
    }
  }

  export function getObjectIndexValue(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = getClasses().find(c => c.className === className);
    // console.log('c',c)
    if (c && _.isString(c.uniqueKey)) {
      return obj[c.uniqueKey];
    }
  }

  export function getClassBy(className: string | Function): Function {
    let res;
    if (Array.isArray(className)) {
      if (className.length !== 1) {
        throw `Mapping error... please use proper class names:
  {
    propertyObject: 'MyClassName',
    propertyWithArray: ['MyClassName']
  }

        `
      }
      className = className[0]
    }
    if (typeof className === 'function') { // TODO QUICK_FIX
      res = className;
    }
    if (className === 'Date') {
      res = Date;
    }

    let c = getClasses().find(c => c.className === className);

    if (c) {
      res = c.target;
    }
    // console.log(`getClassBy "${className} return \n\n ${res} \n\n`)
    // @ts-ignore
    return res;
  }

}
