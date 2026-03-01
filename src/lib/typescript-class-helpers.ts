import * as FormData from 'form-data'; // @backend
import { _, CoreModels, UtilsOs } from 'tnp-core/src';
import { Helpers } from 'tnp-core/src';

const REGISTRY_SYMBOL = Symbol.for('TAON.CLASS_REGISTRY');

type Registry = Map<string, Function>;

function getRegistry(): Registry {
  const g = globalThis as any;

  if (!g[REGISTRY_SYMBOL]) {
    g[REGISTRY_SYMBOL] = new Map<string, Function>();
  }

  return g[REGISTRY_SYMBOL];
}

const classes = getRegistry();

export function getClassName(target: Function): string | undefined {
  if (_.isNil(target)) {
    return void 0;
  }
  if (_.isString(target)) {
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

  if (!_.isNil(target[CoreModels.ClassNameStaticProperty])) {
    return target[CoreModels.ClassNameStaticProperty];
  }

  // special thing when cloning classes
  if (target.name?.startsWith('class_')) {
    return '';
  }

  return;
}

export function getFromObject(o: Object) {
  if (_.isUndefined(o) || _.isNull(o)) {
    return;
  }
  if (o.constructor) {
    return o.constructor;
  }
  const p = Object.getPrototypeOf(o);
  return p && p.constructor;
}

const notAllowedAsMethodName = [
  'length',
  'name',
  'arguments',
  'caller',
  'constructor',
  'apply',
  'bind',
  'call',
  'toString',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'valueOf',
  '__proto__',
  'toLocaleString',
];

export namespace CLASS {
  /**
   * PLEASE PROVIDE NAME AS TYPED STRING, NOT VARIABLE
   * Decorator requred for production mode
   * @param name Name of class
   */
  export function NAME(className: string) {
    return function (target: Function) {
      return setClassName(target, className);
    } as any;
  }

  export function setName(target: Function, className: string) {
    setClassName(target, className);
  }

  export function getClassNameFromObjInstanceOrClassFn(
    target: any,
  ): string | undefined {
    if (typeof target === 'object') {
      return getNameFromObject(target);
    }
    return getClassName(target);
  }

  export function setClassName(target: Function, className: string): void {
    target[CoreModels.ClassNameStaticProperty] = className;
    classes.set(className, target);
  }
  export function getBy(className: string | Function): Function {
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

    const classFromMap = classes.get(className as string);
    return classFromMap ? classFromMap : res;
  }

  export function getFromObject(o: Object): Function | undefined{
    if (_.isUndefined(o) || _.isNull(o)) {
      return;
    }
    if (o.constructor) {
      return o.constructor;
    }
    const p = Object.getPrototypeOf(o);
    return p && p.constructor;
  }

  export function getName(target: Function): string | undefined {
    return getClassName(target) as string;
  }
  export function getNameFromObject(o: Object): string | undefined {
    const fnCLass = getFromObject(o);
    return getName(fnCLass);
  }

  export const getMethodsNames = (
    classOrClassInstance: any,
    allMethodsNames = [],
  ): string[] => {
    if (!classOrClassInstance) {
      return allMethodsNames;
    }

    const isClassFunction = _.isFunction(classOrClassInstance);
    const classFun = isClassFunction
      ? classOrClassInstance
      : Object.getPrototypeOf(classOrClassInstance);
    const objectToCheck = isClassFunction
      ? (classOrClassInstance as Function)?.prototype
      : classOrClassInstance;
    const prototypeObj = Object.getPrototypeOf(objectToCheck || {});

    const properties = _.uniq([
      ...Object.getOwnPropertyNames(objectToCheck || {}),
      ...Object.getOwnPropertyNames(prototypeObj || {}),
      ...Object.keys(objectToCheck || {}),
      ...Object.keys(prototypeObj || {}),
    ]).filter(f => !!f && !notAllowedAsMethodName.includes(f));

    properties
      .filter(methodName => typeof objectToCheck[methodName] === 'function')
      .forEach(p => allMethodsNames.push(p));

    if (
      !classFun ||
      !classFun.constructor ||
      classFun?.constructor?.name === 'Object'
    ) {
      return allMethodsNames;
    }
    return getMethodsNames(Object.getPrototypeOf(classFun), allMethodsNames);
  };
}
