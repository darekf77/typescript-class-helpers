import * as _ from 'lodash';
import { Models } from './models';
import { SYMBOL } from './symbols';
import { Helpers } from './index';

export namespace CLASSNAME {


  CLASSNAME.prototype.classes = [];

  export function getClassConfig(target: Function, configs: Models.ClassConfig[] = []): Models.ClassConfig[] {
    if (!_.isFunction(target)) {
      throw `[typescript-class-helper][getClassConfig]
Cannot get class config from: ${target}`
    }
    const meta = SYMBOL.CLASS_META_CONFIG + target.name;
    // if (!target.prototype[meta]) target.prototype[meta] = {};
    let c: Models.ClassConfig;
    if (target[meta]) {
      c = target[meta];
    } else {
      c = new Models.ClassConfig();
      c.classReference = target;
      target[meta] = c;
    }
    configs.push(c);
    const proto = Object.getPrototypeOf(target)
    if (proto.name && proto.name !== target.name) {
      getClassConfig(proto, configs)
    }
    return configs;
  }



  /**
   * PLEASE PROVIDE NAME AS TYPED STRING, NOT VARIABLE
   * Decorator requred for production mode
   * @param name Name of class
   */
  export function CLASSNAME(className: string, uniqueKey = 'id', classFamily?: string) {

    return function (target: Function) {
      // console.log(`CLASSNAME Inited ${className}`)
      if (target.prototype) {
        target.prototype[SYMBOL.CLASSNAMEKEY] = className
      }

      const existed = (CLASSNAME.prototype.classes as { className: string; target: Function; }[])
        .find(f => f.className === className)

      if (existed) {
        existed.target = target;
      } else {
        const res = {
          className,
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

        CLASSNAME.prototype.classes.push(res)
      }

    } as any;
  }

  export function getClassName(target: Function, production = false) {
    if (!target || _.isString(target)) {
      return target;
    }

    if (target.prototype && target.prototype[SYMBOL.CLASSNAMEKEY]) {
      return target.prototype[SYMBOL.CLASSNAMEKEY];
    }
    if (production) {
      throw `(PRODUCTION MODE ERROR)
              Please use decoartor @CLASSNAME for each entity or controller
              This is preventing class name problem in minified code.

              import { CLASSNAME } from 'morphi/browser';

              @CLASSNAME('ExampleClass')
              class ExampleClass {
                ...
              }
              `
    }
    return target.name;
  }

  export function getObjectIndexPropertyValue(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = CLASSNAME.prototype.classes.find(c => c.className === className);
    // console.log('c',c)
    if (c) {
      return c.uniqueKey;
    }
  }

  export function getClassFamilyByClassName(className: string) {
    let c = CLASSNAME.prototype.classes.find(c => c.className === className);
    // console.log('CLASSNAME.prototype.classes', CLASSNAME.prototype.classes)
    if (c) {
      return c.classFamily;
    }
  }

  export function getObjectClassFamily(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = CLASSNAME.prototype.classes.find(c => c.className === className);
    // console.log('c',c)
    if (c) {
      return c.classFamily;
    }
  }

  export function getObjectIndexValue(obj: any) {
    const className = Helpers.getNameFromObject(obj);
    // console.log('className',className)
    let c = CLASSNAME.prototype.classes.find(c => c.className === className);
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

    let c = CLASSNAME.prototype.classes.find(c => c.className === className);

    if (c) {
      res = c.target;
    }
    // console.log(`getClassBy "${className} return \n\n ${res} \n\n`)
    return res;
  }

}
