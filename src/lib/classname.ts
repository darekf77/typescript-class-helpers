import { _ } from 'tnp-core/src';
import { Models } from './models';
import { SYMBOL } from './symbols';
import { TchHelpers } from './index';
import { Helpers } from 'tnp-core/src';
import { getStorage } from './storage';
import { setClassName } from './set-class-name';
import { registerd } from './registerd-db';
import { ERROR_MSG_CLASS_WITHOUT_DECORATOR } from './errors-messages';
//#region @backend
import * as FormData from 'form-data';
//#endregion

function getClasses(): Models.ClassMeta[] {
  const s = getStorage();
  return s[SYMBOL.CLASSES] as any;
}
export namespace CLASSNAME {
  export function getClassConfig(
    target: Function,
    configs: Models.ClassConfig[] = [],
    callerTarget?: Function,
  ): Models.ClassConfig[] {
    if (!_.isFunction(target)) {
      throw `[typescript-class-helper][getClassConfig] Cannot get class config from: ${target}`;
    }

    let config: Models.ClassConfig;
    const parentClass = Object.getPrototypeOf(target);
    const isValidParent = _.isFunction(parentClass) && parentClass.name !== '';

    if (registerd.classes.includes(target)) {
      config =
        registerd.configs[registerd.classes.findIndex(c => c === target)];
    } else {
      config = new Models.ClassConfig();
      config.classReference = target;
      registerd.classes.push(target);
    }

    registerd.configs[registerd.classes.findIndex(c => c === target)] = config;
    if (callerTarget) {
      const callerTargetConfig =
        registerd.configs[registerd.classes.findIndex(c => c === callerTarget)];
      if (!config.vChildren.includes(callerTargetConfig)) {
        config.vChildren.push(callerTargetConfig);
      }
      callerTargetConfig.vParent = config;
    }

    configs.push(config);

    return isValidParent
      ? getClassConfig(parentClass, configs, target)
      : configs;
  }

  /**
   * PLEASE PROVIDE NAME AS TYPED STRING, NOT VARIABLE
   * Decorator requred for production mode
   * @param name Name of class
   */
  export function CLASSNAME(
    className: string,
    options?: Models.CLASSNAMEOptions,
  ) {
    return function (target: Function) {
      // console.log(`CLASSNAME Inited ${className}`)
      return setClassName(target, className, options);
    } as any;
  }

  export function getClassName(target: Function, production = false) {
    if (_.isNil(target)) {
      // console.log(target);
      // Helpers.warn(`[typescript-class-helpers][getClassName] target is nil`)
      return void 0;
    }
    if (_.isString(target)) {
      // console.log(target);
      Helpers.log(
        `[typescript-class-helpers][getClassName] target is string: '${target}', produciton: ${production}`,
      );
      return target;
    }

    if (target === Date) {
      return 'Date';
    }

    if ((target as any) === FormData) {
      return 'FormData';
    }

    if (!_.isFunction(target)) {
      // console.log(target);
      Helpers.log(
        `[typescript-class-helpers][getClassName] target is not a class`,
      );
      return void 0;
    }

    if (target[SYMBOL.ClassNameStaticProperty]) {
      return target[SYMBOL.ClassNameStaticProperty];
    }

    const configs = getClassConfig(target);
    const config = _.first(configs);

    const classNameInBrowser = config?.classNameInBrowser;

    if (Helpers.isBrowser && _.isString(classNameInBrowser)) {
      return classNameInBrowser;
    }

    const className = config?.className;

    if (typeof className === 'string') {
      return className;
    }

    if (production) {
      console.log('class without @CLASS.NAME deocrator', target as any);
      throw new Error(ERROR_MSG_CLASS_WITHOUT_DECORATOR);
    } else {
      // Helpers.log('check for ' + target.name)
      // setTimeout(() => {
      //   // Helpers.log('check for ' + target.name + ' === ' + config.className)/
      //   // TODO this may work, but not yet in singleton/morphi
      //   if (!config.className) {
      //     if (target?.name && target.name !== 'Object') {
      //       ConfigHelpers.log(`[typescript-class-helpers] Please use @CLASS.NAME`
      //         + `('${(target?.name && !!target.name) ? target.name : '...'}') decorator for class ${target?.name}`)
      //     }
      //   }
      // })
    }

    // special thing when cloning classes
    if (target.name?.startsWith('class_')) {
      return '';
    }

    return target.name;
  }

  // @ts-ignore
  export function getObjectIndexPropertyValue(obj: any) {
    const className = TchHelpers.getNameFromObject(obj);
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
    const className = TchHelpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = getClasses().find(c => c.className === className);
    // console.log('c',c)
    if (c) {
      return c.classFamily;
    }
  }

  export function getObjectIndexValue(obj: any) {
    const className = TchHelpers.getNameFromObject(obj);
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

        `;
      }
      className = className[0];
    }
    if (typeof className === 'function') {
      // TODO QUICK_FIX
      res = className;
    }
    if (className === 'Date') {
      res = Date;
    }

    if (className === 'FormData') {
      res = FormData;
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
