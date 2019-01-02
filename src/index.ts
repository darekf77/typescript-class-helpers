
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
  getBy: Helpers.getBy,
  getConfig: Helpers.getConfig,
  getFromObject: Helpers.getFromObject,
  getName: Helpers.getName,
  getNameFromObject: Helpers.getNameFromObject,
  describeProperites: Helpers.describeProperites
}

