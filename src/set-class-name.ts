import * as _ from 'lodash';

import { SYMBOL } from './symbols';
import { Models } from './models';
import { getStorage } from './storage';
import { CLASSNAME } from './classname';
import { CLASS } from './index';


function getClasses(): Models.ClassMeta[] {
  const s = getStorage();
  return s[SYMBOL.CLASSES] as any;
}


export function setClassName(target: Function, className: string, options?: Models.CLASSNAMEOptions) {

  let { classFamily, uniqueKey, classNameInBrowser, singleton } = options || {
    classFamily: void 0,
    uniqueKey: 'id',
    classNameInBrowser: void 0,
    singleton: void 0,
    autoinstance: false
  } as Models.CLASSNAMEOptions;

  if (!_.isUndefined(singleton) && _.isBoolean(singleton) && singleton) {
    singleton = 'first-instance'
  }

  if (!uniqueKey) {
    uniqueKey = 'id'
  }

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
          const parent = Object.getPrototypeOf(target);
          if (!_.isFunction(parent) || parent.name === 'Object' || parent.name === '') {
            return className;
          }
          const classNameNew = CLASSNAME.getClassName(parent)
          return CLASSNAME.getClassFamilyByClassName(classNameNew)
        }
      })
    }
    getClasses().push(res)
  }
  const Original = target;


  if (singleton === 'first-instance' || singleton === 'last-instance') {
    const obj = {
      decoratedConstructor: function (...args) {
        // console.log(`DECORATED CONSTRUCTOR OF ${Original.name}`)
        const context = Original.apply(this, args);

        const existedSingleton = CLASS.getSingleton(Original)
        if (!existedSingleton || singleton === 'last-instance') {
          CLASS.setSingletonObj(Original, this)
          CLASS.setSingletonObj(obj.decoratedConstructor, this)
          // console.log(`Singleton created for "${className}", mode: ${singleton} `);
        }
        else {
          // console.log('ingleton exists')
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
    // (obj.decoratedConstructor as any).name = className;
    // console.log('return new contruor', decoratedConstructor)
    return obj.decoratedConstructor;
  } else if (singleton === 'autoinstance') {

    // console.log(`AUTOINSTANCE FOR ${target.name}`)
    const auto = new (Original as any)();
    CLASS.setSingletonObj(Original, auto)
    // console.log(`Singleton created for "${className}", mode: ${singleton} `)

  }
}
