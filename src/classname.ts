import * as _ from 'lodash';
import { Models } from './models';
import { SYMBOL } from './symbols';
import { Helpers } from './index';
import { Helpers as HelperLogger } from 'ng2-logger';
import { getStorage } from './storage';



function getClasses(): Models.ClassMeta[] {
  const s = getStorage();
  return s.classes as any;
}

export namespace CLASSNAME {

  export function getClassConfig(target: Function, configs: Models.ClassConfig[] = []): Models.ClassConfig[] {
    if (!_.isFunction(target)) {
      throw `[typescript-class-helper][getClassConfig]
Cannot get class config from: ${target}`
    }
    const meta = SYMBOL.CLASS_META_CONFIG + target.name;

    let c: Models.ClassConfig;
    if (target[meta]) {
      c = target[meta];
    } else {
      c = new Models.ClassConfig();
      c.classReference = target;
      target[meta] = c;
    }
    configs.push(c);
    const baseClass = Object.getPrototypeOf(target)
    if (baseClass.name && baseClass.name !== target.name) {
      getClassConfig(baseClass, configs)
    }
    return configs;
  }



  /**
   * PLEASE PROVIDE NAME AS TYPED STRING, NOT VARIABLE
   * Decorator requred for production mode
   * @param name Name of class
   */
  export function CLASSNAME(className: string,
    options?: {
      uniqueKey?: string,
      singleton?: boolean,
      autoinstance?: boolean,
      classFamily?: string,
      classNameInBrowser?: string,
    }) {

    let { classFamily, uniqueKey, classNameInBrowser, singleton = false, autoinstance } = options || {
      classFamily: void 0,
      uniqueKey: 'id',
      classNameInBrowser: void 0,
      singleton: false,
      autoinstance: false
    };

    if (!uniqueKey) {
      uniqueKey = 'id'
    }

    // console.log(`classAnem: ${className}, isBrower: ${HelperLogger.isBrowser},
    // classNameInBrowser: ${classNameInBrowser} `)
    // if (HelperLogger.isBrowser && _.isString(classNameInBrowser)) {
    //   className = classNameInBrowser;
    // }

    return function (target: Function) {
      // console.log(`CLASSNAME Inited ${className}`)
      if (target) {
        target[SYMBOL.CLASSNAMEKEY] = className;
        target[SYMBOL.CLASSNAMEKEYBROWSER] = classNameInBrowser;
      }

      const existed = (getClasses() as { className: string; target: Function; }[])
        .find(f => f.className === className)

      if (existed) {
        existed.target = target;
      } else {
        const res = {
          className,
          classNameInBrowser,
          target,
          uniqueKey,
          classFamily
        }

        if (_.isUndefined(classFamily)) {
          Object.defineProperty(res, 'classFamily', {
            get: function () {
              const parent = target['__proto__']
              // console.log(`parent of ${className}: '${parent.name}'`)
              // console.log(`parent typpeof`,typeof parent)
              // console.log('parent is fun', _.isFunction(parent.name))
              if (!_.isFunction(parent) || parent.name === 'Object' || parent.name === '') {
                return className;
              }
              const classNameNew = getClassName(parent)
              // console.log('classNameNew', classNameNew)
              return getClassFamilyByClassName(classNameNew)
            }
          })
        }

        // console.log(`CLASSNAME: ${className}`, res)

        getClasses().push(res)
      }
      // console.log(`CLASS: ${target.name}, singleton: ${singleton}, autoinstance: ${autoinstance}`)
      if (singleton) {
        const Original = target;

        // the new constructor behaviour
        var obj = {
          decoratedConstructor: function (...args) {
            // console.log(`DECORATED CONSTRUCTOR OF ${Original.name}`)
            const context = Original.apply(this, args);
            const singletons = getStorage(SYMBOL.SINGLETONS);
            const singletonInstance = singletons[className]; // CLASS.getSingleton(obj.decoratedConstructor)

            if (singleton && !singletonInstance) {
              // console.log('Singleton is set !')
              singletons[className] = this;
              // CLASS.setSingletonObj(obj.decoratedConstructor, this)
            }
            return context;
          }
        };

        // copy prototype so intanceof operator still works
        obj.decoratedConstructor.prototype = Original.prototype;

        Object.keys(Original).forEach((name: string) => { obj.decoratedConstructor[name] = (<any>Original)[name]; });
        Object.defineProperty(obj.decoratedConstructor, 'name', {
          value: className,
          configurable: true,
        })
        if (autoinstance) {
          // console.log(`AUTOINSTANCE FOR ${target.name}`)
          const auto = new (Original as any)();
          const singletons = getStorage(SYMBOL.SINGLETONS);
          singletons[className] = auto;
        }

        // (obj.decoratedConstructor as any).name = className;
        // console.log('return new contruor', decoratedConstructor)
        return obj.decoratedConstructor;
      }
    } as any;
  }

  export function getClassName(target: Function, production = false) {
    if (_.isString(target)) {
      console.trace(target);
      console.warn(`[tch][getClassName] target is string: '${target}', produciton: ${production}`)
      return target;
    }
    if (!_.isFunction(target)) {
      console.trace(target);
      console.error(`[tch][getClassName] target is not a class`)
      return void 0;
    }

    if (HelperLogger.isBrowser && _.isString(target[SYMBOL.CLASSNAMEKEYBROWSER])) {
      return target[SYMBOL.CLASSNAMEKEYBROWSER];
    }
    if (target[SYMBOL.CLASSNAMEKEY]) {
      return target[SYMBOL.CLASSNAMEKEY];
    }
    if (production) {
      console.error(`[tch][getClassName(...)](PRODUCTION MODE ERROR)
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

  export function getObjectIndexPropertyValue(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = getClasses().find(c => c.className === className);
    // console.log('c',c)
    if (c) {
      return c.uniqueKey;
    }
  }

  export function getClassFamilyByClassName(className: string) {
    let c = getClasses().find(c => c.className === className);
    // console.log('getClasses()', getClasses())
    if (c) {
      return c.classFamily;
    }
  }

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
    return res;
  }

}
