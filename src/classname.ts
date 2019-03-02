import * as _ from 'lodash';
import { Models } from './models';
import { SYMBOL } from './symbols';
import { Helpers } from 'ng2-logger';


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
  export function CLASSNAME(className: string) {

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
        CLASSNAME.prototype.classes.push({
          className,
          target
        })
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
